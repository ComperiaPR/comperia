import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { CustomMultiSelect, Option } from '../../components/CustomMultiSelect';

// Simple Google Maps loader without extra deps
function useGoogleMaps(apiKey: string) {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if ((window as any).google?.maps) {
      setLoaded(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps]');
    if (existing) {
      existing.addEventListener('load', () => setLoaded(true), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`;
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
}

function FiltersAndTable({ fetchVisible, mapRef }: { fetchVisible: () => Promise<void> | void; mapRef: React.RefObject<any>; }) {
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
  const [options, setOptions] = useState<any>({ municipalities: [], property_types: [], transaction_types: [] });
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<any>({ data: [], meta: null, links: null });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/properties/filters');
      if (res.ok) {
        const data = await res.json();
        setOptions({
          municipalities: data.municipalities || [],
          property_types: data.property_types || [],
          transaction_types: data.transaction_types || []
        });
      }
    })();
  }, []);

  const load = useCallback(async (pageOverride?: number) => {
    setLoading(true);
    const bounds = mapRef.current?.getBounds?.();
    const ne = bounds?.getNorthEast?.();
    const sw = bounds?.getSouthWest?.();

    const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.municipality_id.length) filters.municipality_id.forEach((id: string) => params.append('municipality_id[]', id));
  if (filters.property_type_id.length) filters.property_type_id.forEach((id: string) => params.append('property_type_id[]', id));
  if (filters.transaction_type_id.length) filters.transaction_type_id.forEach((id: string) => params.append('transaction_type_id[]', id));
    if (filters.date_from) params.set('date_from', filters.date_from);
    if (filters.date_to) params.set('date_to', filters.date_to);
    if (filters.price_min) params.set('price_min', filters.price_min);
    if (filters.price_max) params.set('price_max', filters.price_max);
    if (filters.area_min) params.set('area_min', filters.area_min);
    if (filters.area_max) params.set('area_max', filters.area_max);
    params.set('page', String(pageOverride ?? page));

    const res = await fetch(`/api/properties/search?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  }, [filters, mapRef, page]);

  // Eliminar debounce: la búsqueda se ejecuta solo con el botón

  // Sync table with map when bounds restriction is active
  useEffect(() => {
    if (!filters.restrictToBounds) return;

    const handleMapMove = () => {
      // Debounce to avoid excessive requests
      const timer = setTimeout(() => {
        load(1);
      }, 1500);
      return () => clearTimeout(timer);
    };

    const map = mapRef.current;
    if (map && (window as any).google?.maps) {
      const listener = map.addListener('idle', handleMapMove);
      return () => {
        if ((window as any).google?.maps?.event) {
          (window as any).google.maps.event.removeListener(listener);
        }
      };
    }
  }, [filters.restrictToBounds, load, mapRef]);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded shadow border p-3">
      <form
        className="space-y-3 mb-3"
        onSubmit={(e) => { e.preventDefault(); load(1); }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Custom MultiSelect para municipios */}
          <CustomMultiSelect
            options={options.municipalities.map((m: any) => ({ label: m.name, value: String(m.id) }))}
            value={filters.municipality_id}
            onChange={(selected: (string | number)[]) => setFilters({ ...filters, municipality_id: selected })}
            maxTags={3}
            placeholder="Selecciona municipios"
          />
          {/* Custom MultiSelect para tipos de propiedad */}
          <CustomMultiSelect
            options={options.property_types.map((t: any) => ({ label: t.name, value: String(t.id) }))}
            value={filters.property_type_id}
            onChange={(selected: (string | number)[]) => setFilters({ ...filters, property_type_id: selected })}
            maxTags={3}
            placeholder="Selecciona tipos de propiedad"
          />
          {/* Custom MultiSelect para tipos de transacción */}
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
            onChange={(e) => setFilters({ ...filters, price_min: e.target.value })}
          />
          <input
            type="number"
            className="border rounded px-2 py-1"
            placeholder="Precio máximo"
            value={filters.price_max}
            onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="number"
            className="border rounded px-2 py-1"
            placeholder="Área mínima (mt²)"
            value={filters.area_min}
            onChange={(e) => setFilters({ ...filters, area_min: e.target.value })}
          />
          <input
            type="number"
            className="border rounded px-2 py-1"
            placeholder="Área máxima (mt²)"
            value={filters.area_max}
            onChange={(e) => setFilters({ ...filters, area_max: e.target.value })}
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            placeholder="Fecha de reporte inicial"
            value={filters.date_from}
            onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            placeholder="Fecha de reporte final"
            value={filters.date_to}
            onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
          />
        </div>
        <div className="flex gap-3 items-center">
          <input
            className="border rounded px-2 py-1 flex-1"
            placeholder="Palabra clave (calle, registro, catastro...)"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
          <button
            type="button"
            className="border border-blue-600 text-blue-600 rounded px-3 py-1 hover:bg-blue-50 dark:hover:bg-neutral-800"
            onClick={() => load(1)}
          >Buscar</button>
          <button
            type="button"
            className="border border-red-400 text-red-600 rounded px-3 py-1 hover:bg-red-50 dark:hover:bg-neutral-800"
            onClick={() => setFilters({
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
            })}
          >Limpiar filtros</button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Dirección</th>
              <th className="py-2">Municipio</th>
              <th className="py-2">Tipo</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                {[1,2,3,4,5].map(i => (
                  <tr key={i} className="border-b animate-pulse">
                    <td className="py-2"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="py-2"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="py-2"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="py-2"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="py-2"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="py-2"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))}
              </>
            ) : data.data?.length ? (
              data.data.map((p: any) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2">{p.id}</td>
                  <td className="py-2">{[p.street, p.unit_number].filter(Boolean).join(' ') || '-'}</td>
                  <td className="py-2">{p.municipality?.name || p.municipality_id}</td>
                  <td className="py-2">{p.property_type?.name || p.property_type_id}</td>
                  <td className="py-2">{p.property_status?.name || p.property_status_id}</td>
                  <td className="py-2">{p.updated_at ? new Date(p.updated_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="py-4 text-center">Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 text-sm">
        <button
          className="border rounded px-2 py-1 disabled:opacity-50"
          onClick={() => { const p = Math.max(1, (data.current_page ?? 1) - 1); setPage(p); load(p); }}
          disabled={(data.current_page ?? 1) <= 1}
        >Anterior</button>
        <div>Página {data.current_page ?? 1} de {data.last_page ?? 1}</div>
        <button
          className="border rounded px-2 py-1 disabled:opacity-50"
          onClick={() => { const p = Math.min((data.last_page ?? 1), (data.current_page ?? 1) + 1); setPage(p); load(p); }}
          disabled={(data.current_page ?? 1) >= (data.last_page ?? 1)}
        >Siguiente</button>
      </div>
    </div>
  );
}

export default function MapPreview() {
  const apiKey = (document.querySelector('meta[name="gmaps-key"]') as HTMLMetaElement)?.content || '';
  const loaded = useGoogleMaps(apiKey);
  // Use any to avoid ts complaints; in project you can add @types/google.maps
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const versionRef = useRef<number | null>(null);
  const [info, setInfo] = useState<{ total: number; cached_at?: string; version?: number } | null>(null);
  const [loadingMap, setLoadingMap] = useState<boolean>(false);

  const initMap = useCallback(() => {
    if (!loaded || mapRef.current) return;
    const center = { lat: 18.2208, lng: -66.5901 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapRef.current = new (window as any).google.maps.Map(document.getElementById('map') as HTMLElement, {
      center,
      zoom: 9,
      mapId: 'DEMO_MAP_ID',
      gestureHandling: 'greedy',
    });

    // Initialize clusterer
    clustererRef.current = new MarkerClusterer({
      map: mapRef.current,
      markers: [],
    });

    mapRef.current.addListener('idle', () => {
      fetchVisible();
    });

    // initial
    fetchVisible();
  }, [loaded]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  const fetchVisible = useCallback(async () => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    if (!bounds) return;

    setLoadingMap(true);

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const body = {
      north: ne.lat(),
      south: sw.lat(),
      east: ne.lng(),
      west: sw.lng(),
      zoom: mapRef.current.getZoom() ?? 9,
    };

    const params = new URLSearchParams({
      north: String(body.north),
      south: String(body.south),
      east: String(body.east),
      west: String(body.west),
      zoom: String(body.zoom),
    });
    
    try {
      const res = await fetch(`/api/properties/in-bounds?${params.toString()}`);

      if (!res.ok) return;
      const data = await res.json();

      // save version to detect updates
      versionRef.current = data.version;

      // clear markers from clusterer
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      const { properties } = data as { properties: ApiProperty[] } as any;

      // Create new markers
      const newMarkers = properties.map((p: ApiProperty) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new (window as any).google.maps.Marker({
          position: { lat: Number(p.latitude), lng: Number(p.longitude) },
          title: p.street || `Property ${p.id}`,
        });
      });

      markersRef.current = newMarkers;

      // Add markers to clusterer
      if (clustererRef.current) {
        clustererRef.current.addMarkers(newMarkers);
      }

      setInfo({ total: properties.length, cached_at: data.cached_at, version: data.version });
    } finally {
      setLoadingMap(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/properties/last-update');
      if (!res.ok) return;
      const data = await res.json();
      if (versionRef.current !== null && data.version && data.version !== versionRef.current) {
        // refresh if server version bumped
        fetchVisible();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchVisible]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <Head title="Map Preview" />

      <div className="bg-white dark:bg-neutral-900 rounded shadow border p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold flex items-center gap-2">
            Mapa
            {loadingMap && (
              <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
          <div className="text-xs opacity-70">
            {info && (
              <>
                <span className="mr-2">Marcadores: {info.total}</span>
                {info.cached_at && <span className="mr-2">Cache: {new Date(info.cached_at).toLocaleTimeString()}</span>}
                {info.version && <span>v{info.version}</span>}
              </>
            )}
          </div>
        </div>
        <div id="map" className="w-full" style={{ height: 360 }} />
      </div>

      <FiltersAndTable fetchVisible={fetchVisible} mapRef={mapRef} />
    </div>
  );
}
