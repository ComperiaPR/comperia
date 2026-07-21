import { useEffect, useState } from 'react';

// Loads the Google Maps JS SDK once and reuses it across pages.
// The API key comes from the <meta name="gmaps-key"> tag rendered in app.blade.php.
export function useGoogleMaps(apiKey: string) {
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

export function useGoogleMapsApiKey(): string {
    if (typeof document === 'undefined') return '';
    return (document.querySelector('meta[name="gmaps-key"]') as HTMLMetaElement)?.content || '';
}
