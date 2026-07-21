import { useCallback, useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Check, Copy, LocateFixed, MapPin } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoogleMaps, useGoogleMapsApiKey } from '@/hooks/use-google-maps';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Geolocalization', href: '/geolocation' },
];

interface Position {
    latitude: number;
    longitude: number;
    accuracy: number;
}

export default function Geolocation() {
    const apiKey = useGoogleMapsApiKey();
    const mapsLoaded = useGoogleMaps(apiKey);

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    const [position, setPosition] = useState<Position | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState<'lat' | 'lng' | 'both' | null>(null);

    const locate = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (result) => {
                setPosition({
                    latitude: result.coords.latitude,
                    longitude: result.coords.longitude,
                    accuracy: result.coords.accuracy,
                });
                setLoading(false);
            },
            (err) => {
                setError(
                    err.code === err.PERMISSION_DENIED
                        ? 'Location access was denied. Please allow location permissions and try again.'
                        : 'Unable to retrieve your location.',
                );
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    }, []);

    // Request the location automatically on first visit.
    useEffect(() => {
        locate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Render/update the map whenever we get a position and the SDK is ready.
    useEffect(() => {
        if (!mapsLoaded || !position || !mapRef.current) return;

        const center = { lat: position.latitude, lng: position.longitude };
        const google = (window as any).google;

        if (!mapInstanceRef.current) {
            mapInstanceRef.current = new google.maps.Map(mapRef.current, {
                center,
                zoom: 16,
                gestureHandling: 'greedy',
            });
        } else {
            mapInstanceRef.current.setCenter(center);
        }

        if (markerRef.current) {
            markerRef.current.setPosition(center);
        } else {
            markerRef.current = new google.maps.Marker({ position: center, map: mapInstanceRef.current });
        }
    }, [mapsLoaded, position]);

    const copy = (value: string, which: 'lat' | 'lng' | 'both') => {
        navigator.clipboard.writeText(value);
        setCopied(which);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Geolocalization" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="w-full border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" /> Geolocalization
                        </CardTitle>
                        <Button onClick={locate} disabled={loading} size="sm">
                            <LocateFixed className="mr-2 h-4 w-4" />
                            {loading ? 'Locating...' : 'Get My Location'}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {position && (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3">
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground">Latitude</div>
                                        <div className="font-mono text-sm">{position.latitude.toFixed(6)}</div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => copy(String(position.latitude), 'lat')}>
                                        {copied === 'lat' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3">
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground">Longitude</div>
                                        <div className="font-mono text-sm">{position.longitude.toFixed(6)}</div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => copy(String(position.longitude), 'lng')}>
                                        {copied === 'lng' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3">
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground">Accuracy</div>
                                        <div className="font-mono text-sm">± {Math.round(position.accuracy)} m</div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copy(`${position.latitude}, ${position.longitude}`, 'both')}
                                        title="Copy both coordinates"
                                    >
                                        {copied === 'both' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div ref={mapRef} className="h-[420px] w-full rounded-xl border border-slate-200 bg-muted/30" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
