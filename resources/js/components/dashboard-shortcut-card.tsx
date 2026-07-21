import { type ComponentType } from 'react';
import { Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardShortcutCardProps {
    title: string;
    icon: ComponentType<{ className?: string }>;
    color: string;
    disabled?: boolean;
    badge?: string;
    onClick?: () => void;
    /** Internal app route, navigated via Inertia (no full page reload). */
    href?: string;
    /** External URL or static file (e.g. a PDF), opened in a new tab. */
    externalHref?: string;
}

// Quick-access tile used on the dashboard (Contact us, Geolocalization, Legend, Statistics).
export function DashboardShortcutCard({ title, icon: Icon, color, disabled, badge, onClick, href, externalHref }: DashboardShortcutCardProps) {
    const content = (
        <Card
            className={cn(
                'flex h-full flex-col items-center justify-center gap-4 border-slate-200 py-8 shadow-sm transition-shadow',
                disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-md',
            )}
        >
            <span className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">{title}</span>
            <span className={cn('flex h-20 w-20 items-center justify-center rounded-full text-white', color)}>
                <Icon className="h-9 w-9" />
            </span>
            {badge && <span className="text-xs font-medium text-muted-foreground">{badge}</span>}
        </Card>
    );

    if (disabled) {
        return content;
    }

    if (href) {
        return (
            <Link href={href} className="block w-full">
                {content}
            </Link>
        );
    }

    if (externalHref) {
        return (
            <a href={externalHref} target="_blank" rel="noopener noreferrer" className="block w-full">
                {content}
            </a>
        );
    }

    return (
        <button type="button" onClick={onClick} className="w-full text-left">
            {content}
        </button>
    );
}
