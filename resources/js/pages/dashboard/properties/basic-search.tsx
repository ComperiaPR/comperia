import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyFilters } from '@/components/property-filters';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem } from '@/types';
import { Property } from '@/types/property';
import { Municipality, PropertyType, TransactionType } from '@/types/master-data';
import { EMPTY_PROPERTY_FILTERS, PropertyFilterValues } from '@/types/property-filters';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Eye, MapPin } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Properties',
        href: '/properties',
    },
    {
        title: 'Basic Search',
        href: '',
    },
];

interface BasicSearchProps {
    properties: PaginatedData<Property>;
    municipalities: Municipality[];
    property_types: PropertyType[];
    transaction_types: TransactionType[];
    filters: Partial<Record<keyof PropertyFilterValues, string | string[]>>;
}

const toArray = (value?: string | string[]): (string | number)[] => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
};

const BasicSearch = ({ properties, municipalities, property_types, transaction_types, filters }: BasicSearchProps) => {
    const [form, setForm] = useState<PropertyFilterValues>({
        ...EMPTY_PROPERTY_FILTERS,
        q: (filters.q as string) ?? '',
        municipality_id: toArray(filters.municipality_id),
        property_type_id: toArray(filters.property_type_id),
        transaction_type_id: toArray(filters.transaction_type_id),
        price_min: (filters.price_min as string) ?? '',
        price_max: (filters.price_max as string) ?? '',
        area_min: (filters.area_min as string) ?? '',
        area_max: (filters.area_max as string) ?? '',
        date_from: (filters.date_from as string) ?? '',
        date_to: (filters.date_to as string) ?? '',
    });
    const [loading, setLoading] = useState(false);

    const runSearch = useCallback((nextForm: PropertyFilterValues, page = 1) => {
        router.get(
            '/properties/basic-search',
            {
                q: nextForm.q || undefined,
                municipality_id: nextForm.municipality_id.length ? nextForm.municipality_id : undefined,
                property_type_id: nextForm.property_type_id.length ? nextForm.property_type_id : undefined,
                transaction_type_id: nextForm.transaction_type_id.length ? nextForm.transaction_type_id : undefined,
                price_min: nextForm.price_min || undefined,
                price_max: nextForm.price_max || undefined,
                area_min: nextForm.area_min || undefined,
                area_max: nextForm.area_max || undefined,
                date_from: nextForm.date_from || undefined,
                date_to: nextForm.date_to || undefined,
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    }, []);

    const handleSearch = () => runSearch(form, 1);

    const handleClear = () => {
        setForm(EMPTY_PROPERTY_FILTERS);
        router.get('/properties/basic-search', {}, { preserveState: true, preserveScroll: true });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        setLoading(true);
        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <Card className="w-full border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Basic Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <PropertyFilters
                        filters={form}
                        onChange={setForm}
                        onSearch={handleSearch}
                        onClear={handleClear}
                        municipalities={municipalities}
                        property_types={property_types}
                        transaction_types={transaction_types}
                        loading={loading}
                    />
                </CardContent>
            </Card>

            <div className="text-xs text-gray-600">
                {properties.total > 0
                    ? `Showing ${properties.from}-${properties.to} of ${properties.total} properties`
                    : 'No properties found for the selected filters'}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {properties.data.map((property) => (
                    <Card key={property.id} className="overflow-hidden border-slate-200 py-0 shadow-sm transition-shadow hover:shadow-md">
                        {/* No per-property images available: use an icon header as a visual placeholder */}
                        <div className="flex h-24 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400 text-white">
                            <Building2 className="h-10 w-10 opacity-90" />
                        </div>
                        <CardContent className="space-y-2 p-4">
                            <div className="flex items-start justify-between gap-2">
                                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">#{property.id}</code>
                                <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                    {property.transaction_type?.name ?? '-'}
                                </span>
                            </div>

                            <div className="flex items-start gap-1 text-sm font-semibold text-slate-900">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                <span className="line-clamp-2">
                                    {[property.street, property.unit_number].filter(Boolean).join(' ') || 'No address'}
                                    {property.municipality?.name ? `, ${property.municipality.name}` : ''}
                                </span>
                            </div>

                            <div className="text-xs text-slate-600">{property.property_type?.name ?? '-'}</div>

                            <div className="text-lg font-bold text-slate-900">
                                {property.price !== undefined && property.price !== null
                                    ? property.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
                                    : 'Price not available'}
                            </div>

                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                                {property.area_sqr_meter ? <span>{property.area_sqr_meter} m²</span> : null}
                                {property.area_sqr_feet ? <span>{property.area_sqr_feet} ft²</span> : null}
                                {property.sale_date ? <span>{new Date(property.sale_date).toISOString().split('T')[0]}</span> : null}
                            </div>

                            <Link
                                href={'/properties/view/' + property.id}
                                className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md border border-slate-200 py-1.5 text-sm text-blue-600 hover:bg-blue-50"
                            >
                                <Eye className="h-4 w-4" /> View Detail
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {properties.total > properties.per_page && (
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
                    {properties.links.map((link, index) => (
                        <Button
                            key={index}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={loading || !link.url}
                            onClick={() => handlePageChange(link.url)}
                            className="text-xs"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

BasicSearch.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Basic Search" />
        {page}
    </AppLayout>
);

export default BasicSearch;
