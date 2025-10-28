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
    // Cargo sólo la API core para evitar dependencias innecesarias
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.addEventListener('load', () => setLoaded(true), { once: true });
    document.body.appendChild(script);

    return () => {
      // no eliminar script para evitar recargas múltiples en navegación SPA
    };
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

function MapFilters({ filters, setFilters, onSearch, onClear, options }: any) {
  return (
    <form className="space-y-3 mb-3" onSubmit={e => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <CustomMultiSelect
          options={options.municipalities.map((m: any) => ({ label: m.name, value: String(m.id) }))}
          value={filters.municipality_id}
          onChange={(selected: (string | number)[]) => setFilters({ ...filters, municipality_id: selected })}
          maxTags={3}
          placeholder="Selecciona municipios"
        />
        <CustomMultiSelect
          options={options.property_types.map((t: any) => ({ label: t.name, value: String(t.id) }))}
          value={filters.property_type_id}
          onChange={(selected: (string | number)[]) => setFilters({ ...filters, property_type_id: selected })}
          maxTags={3}
          placeholder="Selecciona tipos de propiedad"
        />
        <CustomMultiSelect
          options={options.transaction_types.map((tt: any) => ({ label: tt.name, value: String(tt.id) }))}
          value={filters.transaction_type_id}
          onChange={(selected: (string | number)[]) => setFilters({ ...filters, transaction_type_id: selected })}
          maxTags={3}
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

export default function MapPreview() {
  const apiKey = (document.querySelector('meta[name="gmaps-key"]') as HTMLMetaElement)?.content || '';
  const loaded = useGoogleMaps(apiKey);

  const mapRef = useRef<any>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<any[]>([]);

  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [filters, setFilters] = useState<any>({
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
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [options, setOptions] = useState<any>({ municipalities: [], property_types: [], transaction_types: [] });
  const [loadingProps, setLoadingProps] = useState<boolean>(false);

  // Cargar opciones de filtros
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
        console.error('filters load error', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Cargar propiedades (estado reactivo)
  useEffect(() => {
    let mounted = true;
    setLoadingProps(true);
    (async () => {
      try {
        const res = await fetch('/api/properties/all-locations');
        if (!res.ok) {
          console.error('error fetching properties', res.statusText);
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        setProperties(data.properties || []);
      } catch (err) {
        console.error('error fetching properties', err);
      } finally {
        if (mounted) setLoadingProps(false);
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

  useEffect(() => { initMap(); }, [initMap]);

  // Aplica filtros sobre el arreglo de properties y actualiza marcadores
  const applyFilters = useCallback(() => {
    if (!mapRef.current || !clustererRef.current) return;

    let props = properties.slice(); // copia
    const f = appliedFilters;

    if (f.q) {
      const q = String(f.q).toLowerCase();
      props = props.filter(p =>
        (p.street || '').toLowerCase().includes(q) ||
        (p.unit_number || '').toLowerCase().includes(q)
      );
    }
    if (f.municipality_id && f.municipality_id.length)
      props = props.filter(p => f.municipality_id.includes(String(p.municipality_id)));
    if (f.property_type_id && f.property_type_id.length)
      props = props.filter(p => f.property_type_id.includes(String(p.property_type_id)));
    if (f.transaction_type_id && f.transaction_type_id.length)
      props = props.filter(p => f.transaction_type_id.includes(String(p.transaction_type_id)));
    if (f.price_min) props = props.filter(p => Number(p.price) >= Number(f.price_min));
    if (f.price_max) props = props.filter(p => Number(p.price) <= Number(f.price_max));
    if (f.area_min) props = props.filter(p => Number(p.area) >= Number(f.area_min));
    if (f.area_max) props = props.filter(p => Number(p.area) <= Number(f.area_max));
    if (f.date_from) props = props.filter(p => p.created_at && p.created_at >= f.date_from);
    if (f.date_to) props = props.filter(p => p.created_at && p.created_at <= f.date_to);

    // limpiar marcadores previos
    try {
      clustererRef.current.clearMarkers();
    } catch (err) {
      // algunos builds exponen métodos distintos; defensivamente eliminamos
      console.warn('cluster clearMarkers error', err);
    }
    markersRef.current.forEach(m => { try { m.setMap(null); } catch (_) {} });
    markersRef.current = [];

    // crear nuevos marcadores
    markersRef.current = props.map(p => {
      const marker = new (window as any).google.maps.Marker({
        position: { lat: Number(p.latitude), lng: Number(p.longitude) },
        title: p.street || `Propiedad ${p.id}`
      });
      return marker;
    });

    // agregar al clusterer
    if (markersRef.current.length) {
      clustererRef.current.addMarkers(markersRef.current);
    }
  }, [properties, appliedFilters]);

  // Ejecutar applyFilters cuando cambia appliedFilters o cuando properties se cargan o cuando el mapa esté listo
  useEffect(() => {
    if (!loaded) return;
    applyFilters();
  }, [loaded, properties, appliedFilters, applyFilters]);

  const handleSearch = () => setAppliedFilters({ ...filters });
  const handleClear = () => {
    const cleared = {
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
    setFilters(cleared);
    setAppliedFilters(cleared);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <Head title="Mapa con filtros" />
      <MapFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
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
