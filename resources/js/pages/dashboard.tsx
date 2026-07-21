import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { BookOpen, MapPin, PhoneCall, PieChart } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Plan } from '@/types/master-data';
import { DashboardShortcutCard } from '@/components/dashboard-shortcut-card';
import { ImageCarousel } from '@/components/image-carousel';
import ContactMessageModal from '@/components/contact-message-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface LastPayment {
    date_finish: string;
    plan: Plan | null;
}

interface DashboardProps {
    lastPayment: LastPayment | null;
}

const formatShortDate = (value: string) => {
    const date = new Date(value);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const daysUntil = (value: string) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(value);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / msPerDay);
};

// >10 days: normal · 7-10 days: orange (warning) · ≤6 days (incl. expired): red (urgent)
const expiryColorClass = (daysLeft: number) => {
    if (daysLeft <= 6) return 'text-red-600';
    if (daysLeft <= 10) return 'text-orange-500';
    return 'text-foreground';
};

export default function Dashboard({ lastPayment }: DashboardProps) {
    const [contactOpen, setContactOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {lastPayment && (
                    <div className="text-sm text-muted-foreground">
                        Current plan: <strong className="text-foreground">{lastPayment.plan?.name ?? '—'}</strong> · expires{' '}
                        <strong className={expiryColorClass(daysUntil(lastPayment.date_finish))}>
                            {formatShortDate(lastPayment.date_finish)}
                        </strong>
                    </div>
                )}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="flex flex-col gap-4 md:col-span-1">
                        <DashboardShortcutCard
                            title="Contact us"
                            icon={PhoneCall}
                            color="bg-blue-500"
                            onClick={() => setContactOpen(true)}
                        />
                        <DashboardShortcutCard
                            title="Legend"
                            icon={BookOpen}
                            color="bg-teal-600"
                            // Reemplaza este archivo con el PDF real en public/documents/legend.pdf
                            externalHref="/documents/legend.pdf"
                        />
                    </div>

                    <div className="md:col-span-2">
                        {/* Coloca las fotos en public/images/gallery/ y agrégalas aquí (mismo orden = orden del carrusel) */}
                        <ImageCarousel
                            images={[
                                // '/images/gallery/1.jpg',
                                '/images/gallery/web_1.jpg',
                                '/images/gallery/web_2.jpg',
                                '/images/gallery/web_3.jpg',
                                '/images/gallery/web_4.jpg',
                            ]}
                        />
                    </div>

                    <div className="flex flex-col gap-4 md:col-span-1">
                        <DashboardShortcutCard
                            title="Geolocalization"
                            icon={MapPin}
                            color="bg-slate-700"
                            href="/geolocation"
                        />
                        <DashboardShortcutCard
                            title="Statistics"
                            icon={PieChart}
                            color="bg-gray-400"
                            disabled
                            badge="Coming soon"
                        />
                    </div>
                </div>
            </div>

            <ContactMessageModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
        </AppLayout>
    );
}
