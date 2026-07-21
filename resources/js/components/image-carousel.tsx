import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
    images?: string[];
    intervalMs?: number;
    className?: string;
}

// Simple auto-rotating image gallery. Pass `images` (a list of URLs) once real
// photos are available; until then it renders a neutral placeholder slide.
export function ImageCarousel({ images = [], intervalMs = 5000, className }: ImageCarouselProps) {
    const [index, setIndex] = useState(0);
    const hasImages = images.length > 0;

    const goTo = useCallback(
        (next: number) => {
            if (!hasImages) return;
            setIndex(((next % images.length) + images.length) % images.length);
        },
        [hasImages, images.length],
    );

    useEffect(() => {
        if (!hasImages || images.length < 2) return;
        const timer = setInterval(() => setIndex((prev) => (prev + 1) % images.length), intervalMs);
        return () => clearInterval(timer);
    }, [hasImages, images.length, intervalMs]);

    return (
        <div className={cn('relative aspect-square w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border', className)}>
            {hasImages ? (
                <img src={images[index]} alt="" className="h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/40">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                    <ImageIcon className="relative h-10 w-10 text-muted-foreground" />
                    <span className="relative text-sm text-muted-foreground">Image gallery coming soon</span>
                </div>
            )}

            {hasImages && images.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={() => goTo(index - 1)}
                        className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-background/70 p-1.5 text-foreground shadow hover:bg-background"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => goTo(index + 1)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-background/70 p-1.5 text-foreground shadow hover:bg-background"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`Go to image ${i + 1}`}
                                className={cn('h-1.5 w-1.5 rounded-full transition-all', i === index ? 'w-4 bg-white' : 'bg-white/60')}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
