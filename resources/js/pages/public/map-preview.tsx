import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { PropertyFilters } from '@/components/property-filters';
import { EMPTY_PROPERTY_FILTERS, PropertyFilterValues } from '@/types/property-filters';
import { useGoogleMaps } from '@/hooks/use-google-maps';

interface ApiProperty {
  id: number;
  latitude: number;
  longitude: number;
  street?: string | null;
  unit_number?: string | null;
  municipality_id?: number;
  property_type_id?: number;
  property_type_type?: number | null;
  transaction_type_id?: number;
  price?: number;
  area?: number;
  created_at?: string;
  daily?: number | null;
}

// Mapeo de property_type.type a iconos
// 1 = land, 2 = rent, 3 = commercial, 4 = residential
const PROPERTY_TYPE_ICONS: Record<number, string> = {
  1: '/images/land.png',
  2: '/images/rent.png',
  3: '/images/commercial.png',
  4: '/images/residential.png'
};

function getIconForPropertyType(propertyTypeType?: number | null): string {
  if (!propertyTypeType) return '/images/land.png';
  return PROPERTY_TYPE_ICONS[propertyTypeType] || '/images/land.png';
}

export default function MapPreview() {
  const apiKey = (document.querySelector('meta[name="gmaps-key"]') as HTMLMetaElement)?.content || '';
  const loaded = useGoogleMaps(apiKey);

  const mapRef = useRef<any>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<any[]>([]);
  const iconsLoadedRef = useRef<boolean>(false);
  const infoWindowRef = useRef<any>(null);

  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [filters, setFilters] = useState<PropertyFilterValues>(EMPTY_PROPERTY_FILTERS);
  const [options, setOptions] = useState<any>({ 
    municipalities: [], 
    property_types: [], 
    transaction_types: [] 
  });
  const [loadingProps, setLoadingProps] = useState<boolean>(false);

  // Pre-cargar imágenes de iconos para carga rápida
  useEffect(() => {
    if (iconsLoadedRef.current) return;
    
    const uniqueIcons = [
      '/images/commercial.png',
      '/images/residential.png',
      '/images/rent.png',
      '/images/land.png'
    ];

    uniqueIcons.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    iconsLoadedRef.current = true;
  }, []);

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
    
    // Inicializar InfoWindow para el tooltip
    infoWindowRef.current = new (window as any).google.maps.InfoWindow();
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
    if (!mapRef.current || !clustererRef.current || !infoWindowRef.current) return;

    clustererRef.current.clearMarkers();
    markersRef.current.forEach(m => { 
      try { 
        m.setMap(null); 
      } catch (_) {} 
    });
    markersRef.current = [];

    // Agrupar propiedades por coordenadas exactas
    const locationGroups = new Map<string, ApiProperty[]>();
    props.forEach(p => {
      const key = `${Number(p.latitude).toFixed(6)},${Number(p.longitude).toFixed(6)}`;
      if (!locationGroups.has(key)) {
        locationGroups.set(key, []);
      }
      locationGroups.get(key)!.push(p);
    });

    // Crear marcadores para cada grupo de ubicación
    locationGroups.forEach((groupProps, locationKey) => {
      const firstProp = groupProps[0];
      const isMultiple = groupProps.length > 1;
      
      let iconUrl: string;
      let label: string | undefined;
      
      if (isMultiple) {
        iconUrl = getIconForPropertyType(firstProp.property_type_type);
        label = String(groupProps.length);
      } else {
        iconUrl = getIconForPropertyType(firstProp.property_type_type);
      }
      
      const marker = new (window as any).google.maps.Marker({
        position: { lat: Number(firstProp.latitude), lng: Number(firstProp.longitude) },
        title: isMultiple ? `${groupProps.length} propiedades` : (firstProp.street || `Propiedad ${firstProp.id}`),
        icon: {
          url: iconUrl,
          scaledSize: new (window as any).google.maps.Size(32, 32),
          anchor: new (window as any).google.maps.Point(16, 32)
        },
        label: isMultiple ? {
          text: label,
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        } : undefined
      });

        // Click izquierdo
        marker.addListener('click', () => {
          if (isMultiple) {
            const listItems = groupProps.map(p => {
              const address = p.street ? `${p.street}${p.unit_number ? ' ' + p.unit_number : ''}` : `Propiedad ${p.id}`;
              const price = p.price ? `$${Number(p.price).toLocaleString()}` : 'N/A';
              return `
                <div style="padding: 8px; border-bottom: 1px solid #e5e7eb; cursor: pointer; transition: background-color 0.2s;" 
                     onmouseover="this.style.backgroundColor='#f3f4f6'" 
                     onmouseout="this.style.backgroundColor='white'"
                     onclick="window.open('/properties/view/${p.id}', '_blank')">
                  <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px;">${address}</div>
                  <div style="font-size: 12px; color: #6b7280;">ID: ${p.id} • Precio: ${price}</div>
                  ${p.area ? `<div style="font-size: 12px; color: #6b7280;">Área: ${p.area} m²</div>` : ''}
                </div>
              `;
            }).join('');
            
            const content = `
              <div style="max-width: 300px; max-height: 400px; overflow-y: auto;">
                <div style="padding: 8px; font-weight: 600; background-color: #f9fafb; border-bottom: 2px solid #e5e7eb; position: sticky; top: 0; z-index: 1;">
                  ${groupProps.length} propiedades en esta ubicación
                </div>
                ${listItems}
              </div>
            `;
            
            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(mapRef.current, marker);
          } else {
            window.open(`/properties/view/${firstProp.id}`, '_blank');
          }
        });

        // Click derecho
        marker.addListener('rightclick', (event: any) => {
          event.domEvent.preventDefault();
          
          if (isMultiple) {
            const dailyList = groupProps.map(p => {
              const dailyValue = p.daily ?? 'N/A';
              return `<div style="padding: 2px 0;">ID ${p.id}: ${dailyValue}</div>`;
            }).join('');
            
            infoWindowRef.current.setContent(`
              <div style="padding: 4px 8px; font-weight: 500; max-height: 200px; overflow-y: auto;">
                <div style="font-weight: 600; margin-bottom: 4px;">Daily valores:</div>
                ${dailyList}
              </div>
            `);
          } else {
            const dailyValue = firstProp.daily ?? 'N/A';
            infoWindowRef.current.setContent(`<div style="padding: 4px 8px; font-weight: 500;">${dailyValue} - ${firstProp.id || ''}</div>`);
          }
          
          infoWindowRef.current.setPosition(event.latLng);
          infoWindowRef.current.open(mapRef.current);
          
          setTimeout(() => {
            infoWindowRef.current.close();
          }, 2000);
        });

        markersRef.current.push(marker);
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
        const res = await fetch('/api/properties/all-locations');
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
        property_type_type: p.property_type_type || p.property_type?.type || null,
        transaction_type_id: p.property_status_id || null,
        price: p.price ?? p.price_sqr_meter ?? null,
        area: p.area ?? p.area_sqr_feet ?? null,
        created_at: p.created_at || p.updated_at || null,
        daily: p.daily ?? null,
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
    setFilters(EMPTY_PROPERTY_FILTERS);
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

  const breadcrumbs: BreadcrumbItem[] = [
      { title: 'Map Search', href: '/map/preview' },
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="w-full max-w-auto mx-auto p-4 space-y-4">
        <Head title="Mapa con filtros" />
        <Card className='gap-3'>
          <CardTitle className="px-4 pt-2 py-0 mb-0 pb-0">Property Search</CardTitle>
          <CardContent className='px-4 mt-0 pt-0'>
            <PropertyFilters
              filters={filters}
              onChange={setFilters}
              onSearch={performSearch}
              onClear={handleClear}
              municipalities={options.municipalities}
              property_types={options.property_types}
              transaction_types={options.transaction_types}
              loading={loadingProps}
            />
          </CardContent>
        </Card>
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
    </AppLayout>
  );
}