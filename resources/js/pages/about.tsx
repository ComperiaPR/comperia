import { Head } from '@inertiajs/react';

import { AboutContent } from '@/components/about-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'About Us', href: '/about' },
];

export default function About() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="About Us" />

            <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl p-4">
                <Card className="w-full border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-semibold text-primary">About Us</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AboutContent />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
