import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { CustomMultiSelect } from '../../components/CustomMultiSelect';

function useGoogleMaps(apiKey: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if ((window as any).google?.maps) {
      setLoaded(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps]');
    if (existing) {
      if ((window as any).google?.maps) setLoaded(true);
      else existing.addEventListener('load', () => setLoaded(true), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.addEventListener('load', () => setLoaded(true), { once: true });
    document.body.appendChild(script);
  }, [apiKey]);

  return loaded;
}

interface ApiProperty {
  id: number;
  latitude: number;
  longitude: number;
  street?: string | null;
  unit_number?: string | null;
  municipality_id?: number;
  property_type_id?: number;
  transaction_type_id?: number;
  price?: number;
  area?: number;
  created_at?: string;
}

interface Filters {
  q: string;
  municipality_id: (string | number)[];
  property_type_id: (string | number)[];
  transaction_type_id: (string | number)[];
  price_min: string;
  price_max: string;
  area_min: string;
  area_max: string;
  date_from: string;
  date_to: string;
}

function MapFilters({ filters, setFilters, onSearch, onClear, options }: any) {
  return (
    <form className="space-y-3 mb-3" onSubmit={e => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <CustomMultiSelect
          options={options.municipalities.map((m: any) => ({ label: m.name, value: String(m.id) }))}
          value={filters.municipality_id}
          onChange={(selected: (string | number)[]) => setFilters({ ...filters, municipality_id: selected })}
          maxTags={2}
          placeholder="Selecciona municipios"
        />
        <CustomMultiSelect
          options={options.property_types.map((t: any) => ({ label: t.name, value: String(t.id) }))}
          value={filters.property_type_id}
          onChange={(selected: (string | number)[]) => setFilters({ ...filters, property_type_id: selected })}
          maxTags={2}
          placeholder="Selecciona tipos de propiedad"
        />
        <CustomMultiSelect
          options={options.transaction_types.map((tt: any) => ({ label: tt.name, value: String(tt.id) }))}
          value={filters.transaction_type_id}
          onChange={(selected: (string | number)[]) => setFilters({ ...filters, transaction_type_id: selected })}
          maxTags={2}
          placeholder="Selecciona tipos de transacción"
        />
        <input
          type="number"
          className="border rounded px-2 py-1"
          placeholder="Precio mínimo"
          value={filters.price_min}
          onChange={e => setFilters({ ...filters, price_min: e.target.value })}
        />
        <input
          type="number"
          className="border rounded px-2 py-1"
          placeholder="Precio máximo"
          value={filters.price_max}
          onChange={e => setFilters({ ...filters, price_max: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="number"
          className="border rounded px-2 py-1"
          placeholder="Área mínima (mt²)"
          value={filters.area_min}
          onChange={e => setFilters({ ...filters, area_min: e.target.value })}
        />
        <input
          type="number"
          className="border rounded px-2 py-1"
          placeholder="Área máxima (mt²)"
          value={filters.area_max}
          onChange={e => setFilters({ ...filters, area_max: e.target.value })}
        />
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={filters.date_from}
          onChange={e => setFilters({ ...filters, date_from: e.target.value })}
        />
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={filters.date_to}
          onChange={e => setFilters({ ...filters, date_to: e.target.value })}
        />
      </div>

      <div className="flex gap-3 items-center">
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="Palabra clave (calle, registro, catastro...)"
          value={filters.q}
          onChange={e => setFilters({ ...filters, q: e.target.value })}
        />
        <button
          type="button"
          onClick={onSearch}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={onClear}
          className="border border-gray-400 text-gray-600 rounded px-3 py-1 hover:bg-gray-100"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}

const EMPTY_FILTERS: Filters = {
  q: '',
  municipality_id: [],
  property_type_id: [],
  transaction_type_id: [],
  price_min: '',
  price_max: '',
  area_min: '',
  area_max: '',
  date_from: '',
  date_to: ''
};

export default function MapPreview() {
  const apiKey = (document.querySelector('meta[name="gmaps-key"]') as HTMLMetaElement)?.content || '';
  const loaded = useGoogleMaps(apiKey);

  const mapRef = useRef<any>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<any[]>([]);

  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [options, setOptions] = useState<any>({ 
    municipalities: [], 
    property_types: [], 
    transaction_types: [] 
  });
  const [loadingProps, setLoadingProps] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/properties/filters');
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setOptions({
          municipalities: data.municipalities || [],
          property_types: data.property_types || [],
          transaction_types: data.transaction_types || []
        });
      } catch (err) {
        console.error('Error cargando filtros:', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const initMap = useCallback(() => {
    if (!loaded || mapRef.current) return;
    const center = { lat: 18.2208, lng: -66.5901 };
    mapRef.current = new (window as any).google.maps.Map(document.getElementById('map') as HTMLElement, {
      center,
      zoom: 9,
      gestureHandling: 'greedy'
    });
    clustererRef.current = new MarkerClusterer({ map: mapRef.current, markers: [] });
  }, [loaded]);

  useEffect(() => { 
    initMap(); 
  }, [initMap]);

  useEffect(() => {
    if (!loaded) return;
    let mounted = true;
    
    (async () => {
      try {
        setLoadingProps(true);
        const res = await fetch('/api/properties/all-locations');
        if (!res.ok) throw new Error('Error al cargar propiedades');
        const data = await res.json();
        if (!mounted) return;
        setProperties(data.properties || []);
        updateMarkers(data.properties || []);
      } catch (err) {
        console.error('Error cargando propiedades:', err);
      } finally {
        if (mounted) setLoadingProps(false);
      }
    })();

    return () => { mounted = false; };
  }, [loaded]);

  const updateMarkers = useCallback((props: ApiProperty[]) => {
    if (!mapRef.current || !clustererRef.current) return;

    clustererRef.current.clearMarkers();
    markersRef.current.forEach(m => { 
      try { 
        m.setMap(null); 
      } catch (_) {} 
    });
    markersRef.current = [];

    markersRef.current = props.map(p => {
      const marker = new (window as any).google.maps.Marker({
        position: { lat: Number(p.latitude), lng: Number(p.longitude) },
        title: p.street || `Propiedad ${p.id}`
      });
      return marker;
    });

    if (markersRef.current.length) {
      clustererRef.current.addMarkers(markersRef.current);
    }
  }, []);

  const performSearch = useCallback(async () => {
    if (!loaded) return;

    const hasFilters = filters.q || 
      filters.municipality_id.length > 0 ||
      filters.property_type_id.length > 0 ||
      filters.transaction_type_id.length > 0 ||
      filters.price_min || filters.price_max ||
      filters.area_min || filters.area_max ||
      filters.date_from || filters.date_to;

    if (!hasFilters) {
      try {
        setLoadingProps(true);
        const res = (await fetch('/api/properties/all-locations'));
        if (!res.ok) throw new Error('Error al cargar propiedades');
        const data = await res.json();
        setProperties(data.properties || []);
        updateMarkers(data.properties || []);
      } catch (err) {
        console.error('Error cargando propiedades:', err);
      } finally {
        setLoadingProps(false);
      }
      return;
    }

    const params = new URLSearchParams();
    if (filters.q) params.set('q', String(filters.q));
    
    if (filters.municipality_id.length > 0) {
      filters.municipality_id.forEach(id => params.append('municipality_id[]', String(id)));
    }
    if (filters.property_type_id.length > 0) {
      filters.property_type_id.forEach(id => params.append('property_type_id[]', String(id)));
    }
    if (filters.transaction_type_id.length > 0) {
      filters.transaction_type_id.forEach(id => params.append('transaction_type_id[]', String(id)));
    }
    
    if (filters.price_min) params.set('price_min', String(filters.price_min));
    if (filters.price_max) params.set('price_max', String(filters.price_max));
    if (filters.area_min) params.set('area_min', String(filters.area_min));
    if (filters.area_max) params.set('area_max', String(filters.area_max));
    if (filters.date_from) params.set('date_from', String(filters.date_from));
    if (filters.date_to) params.set('date_to', String(filters.date_to));

    setLoadingProps(true);
    try {
      const res = await fetch(`/api/properties/search?${params.toString()}`);
      if (!res.ok) throw new Error('Error en búsqueda');
      
      const data = await res.json();
      const items = data.data || data.items || [];
      
      const normalized = items.map((p: any) => ({
        id: p.id,
        latitude: p.latitude,
        longitude: p.longitude,
        street: p.street,
        unit_number: p.unit_number,
        municipality_id: p.municipality_id || p.municipality?.id || null,
        property_type_id: p.property_type_id || p.property_type?.id || null,
        transaction_type_id: p.property_status_id || null,
        price: p.price ?? p.price_sqr_meter ?? null,
        area: p.area ?? p.area_sqr_feet ?? null,
        created_at: p.created_at || p.updated_at || null,
      }));

      setProperties(normalized);
      updateMarkers(normalized);
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setProperties([]);
      updateMarkers([]);
    } finally {
      setLoadingProps(false);
    }
  }, [filters, loaded, updateMarkers]);

  const handleClear = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setProperties([]);
    updateMarkers([]);
    
    (async () => {
      try {
        setLoadingProps(true);
        const res = await fetch('/api/properties/all-locations');
        if (!res.ok) return;
        const data = await res.json();
        setProperties(data.properties || []);
        updateMarkers(data.properties || []);
      } catch (err) {
        console.error('Error cargando propiedades:', err);
      } finally {
        setLoadingProps(false);
      }
    })();
  }, [updateMarkers]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <Head title="Mapa con filtros" />
      <MapFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={performSearch}
        onClear={handleClear}
        options={options}
      />
      <div className="bg-white rounded shadow border p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold flex items-center gap-2">Mapa</div>
          <div className="text-xs opacity-70">
            {loadingProps ? 'Cargando propiedades...' : `Propiedades: ${properties.length}`}
          </div>
        </div>
        <div id="map" className="w-full" style={{ height: 420 }} />
      </div>
    </div>
  );
}