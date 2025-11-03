import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Edit, Eye, ListOrdered, MoreVertical, Trash2 } from 'lucide-react';
import { Property } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import HistoryModal from './modals/history-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Propiedades',
        href: '/properties',
    },
];

const ListProperties = ({ properties }: { properties: PaginatedData<Property> }) => {

    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [sort, setSort] = useState<{ column: string; direction: 'asc' | 'desc' }>({ column: '', direction: 'asc' });

    const handlePageChange = (url: string) => {
        setLoading(true);
        router.visit(url, {
            preserveState: true,
            data: {
                sort: sort.column ?? '',
                direction: sort.direction ?? '',
            },
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };
    
    const handleHistory = (propertyId: number) => {
        // router.get(route('properties.history', propertyId), {
        //     preserveScroll: true,
        // });
        setSelectedPropertyId(propertyId);
        setModalOpen(true);
    };

    // Handler para ordenamiento
    const handleSort = (column: string) => {
        const direction = sort.column === column && sort.direction === 'asc' ? 'desc' : 'asc';
        setSort({ column, direction });
        router.visit('/properties/view/list', {
            method: 'get',
            data: {
                // search: 'Bogotá',
                sort: column,
                direction: direction,
                page: 1,
            },
            preserveState: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl p-4">
            <Card className="w-full border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Property Search (Property Registry)</CardTitle>
                        {/* <CardDescription>
                            {properties.total > 0 ? (
                                <>Showing {properties.total} property{properties.total !== 1 ? 'ies' : ''} registered{properties.total !== 1 ? 's' : ''}</>
                            ) : (
                                'Not properties found'
                            )}
                        </CardDescription> */}
                    </div>
                </CardHeader>
                <CardContent className="space-y-">
                            <div className="overflow-x-auto" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                <Table className='overflow-x-none'>
                                    <TableHeader className="sticky top-0 z-10 bg-gray-50">
                                        <TableRow className='text-xs text-gray-700 bg-gray-50 p-0 m-0'>
                                            <TableHead className="px-1 text-xs h-8"></TableHead>
                                            <TableHead className="px-1 text-xs h-8 cursor-pointer" onClick={() => handleSort('id')} >
                                                #ID {sort.column === 'id' && (sort.direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="px-1 text-xs h-8 cursor-pointer" onClick={() => handleSort('municipality_id')} >
                                                Municipality {sort.column === 'municipality_id' && (sort.direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="px-1 text-xs h-8 cursor-pointer" onClick={() => handleSort('transaction_type_id')} >
                                                Transaction {sort.column === 'transaction_type_id' && (sort.direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="px-1 text-xs h-8 cursor-pointer" onClick={() => handleSort('sale_date')} >
                                                Sale Date {sort.column === 'sale_date' && (sort.direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="px-1 text-xs h-8 cursor-pointer" onClick={() => handleSort('track_no')} >
                                                Track No {sort.column === 'track_no' && (sort.direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="px-1 text-xs h-8 cursor-pointer" onClick={() => handleSort('development')} >
                                                Development {sort.column === 'development' && (sort.direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="px-1 text-xs h-8 cursor-pointer" onClick={() => handleSort('street')} >
                                                Street {sort.column === 'street' && (sort.direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="px-1 text-xs h-8">Ward</TableHead>
                                            <TableHead className="px-1 text-xs h-8">Sector</TableHead>
                                            <TableHead className="px-1 text-xs h-8">Property Type</TableHead>
                                            <TableHead className="px-1 text-xs h-8">Sq Mt</TableHead>
                                            <TableHead className="px-1 text-xs h-8">Sq Ft</TableHead>
                                            <TableHead className="px-1 text-xs h-8">Cuerdas</TableHead>
                                            <TableHead className="px-1 text-xs h-8">Sales Price</TableHead>
                                            <TableHead className="px-1 text-xs h-8">Mortagagee</TableHead>
                                            <TableHead className="px-1 text-xs h-8">Buyer</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {properties.data.length > 0 ? (
                                            properties.data.map((property : Property) => (
                                                <TableRow key={property.id} className="hover:bg-muted/50">
                                                    <TableCell className="font-medium p-0">                                                    
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="size-5.5 rounded-full p-1">
                                                                <MoreVertical className="h-4 w-4 text-black" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-auto" align="start">
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={"/properties/view/"+property.id}
                                                                    className="flex items-start justify-start w-full p-0 text-sm text-blue-500 hover:bg-gray-100 bg-default"
                                                                >
                                                                    <Eye className="h-4 w-4 text-blue-500" /> Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Button
                                                                    disabled
                                                                    onClick={() => handleHistory(property.id ?? 0)}
                                                                    className="flex items-start justify-start w-full p-0 text-sm text-fuchsia-700 hover:bg-gray-100 bg-default"
                                                                >
                                                                   <ListOrdered className="h-4 w-4 text-fuchsia-700" /> History
                                                                </Button>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    </TableCell>
                                                    <TableCell className="font-medium p-0">
                                                        <code className="rounded bg-muted p-1 font-mono text-xs">{property.id}</code>
                                                    </TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.municipality?.name}</TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.transaction_type?.name}</TableCell>
                                                    <TableCell className='p-0 text-xs'>
                                                        {property.sale_date
                                                            ? (() => {
                                                                let dateObj: Date;
                                                                if (typeof property.sale_date === 'string') {
                                                                    dateObj = new Date(property.sale_date);
                                                                } else if (property.sale_date instanceof Date) {
                                                                    dateObj = property.sale_date;
                                                                } else {
                                                                    return '';
                                                                }
                                                                // Formatear a yyyy-MM-dd
                                                                const yyyy = dateObj.getFullYear();
                                                                const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                                                                const dd = String(dateObj.getDate() + 1).padStart(2, '0');
                                                                return `${yyyy}-${mm}-${dd}`;
                                                            })()
                                                            : ''}
                                                    </TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.track_no}</TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.development}</TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.street}</TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.ward}</TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.sector}</TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.property_type?.name}</TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.area_sqr_meter}</TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.area_sqr_feet}</TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.area_cuerdas}</TableCell>
                                                    <TableCell className='p-0 text-xs'>
                                                        {property.price !== undefined && property.price !== null
                                                            ? property.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                                            : ''}
                                                    </TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.mortgagee?.name}</TableCell>
                                                    <TableCell className='p-0 text-xs'>{property.buyer}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center">
                                                    <code className="rounded px-2 py-1 text-base">No hay propiedades registradas</code>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                    </div>

                    {/* Paginación */}
                    {properties.total > properties.per_page && (
                        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-xs text-gray-700 dark:text-gray-300">
                                Showing {properties.from} to {properties.to} of {properties.total} properties
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                {/* Botón ir al inicio */}
                                <Button
                                    variant='outline'
                                    className='text-xs'
                                    size="sm"
                                    onClick={() => handlePageChange(properties.links[1]?.url ?? '')}
                                    disabled={loading || !properties.links[1]?.url}
                                    dangerouslySetInnerHTML={{ __html: 'Start' }}
                                />
                                {properties.links.map((link: { url: string | null; label: string; active: boolean }, index: number) => {
                                    if (link.url === null) {
                                        return (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                disabled
                                                className="xs:inline-flex text-xs"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }

                                    return (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(link.url!)}
                                            disabled={loading}
                                            className="xs:inline-flex text-xs"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                                {/* Botón ir al final */}
                                <Button
                                    variant="outline"
                                    className='text-xs'
                                    size="sm"
                                    onClick={() => handlePageChange(properties.links[properties.links.length - 2]?.url ?? '')}
                                    disabled={loading || !properties.links[properties.links.length - 2]?.url}
                                    dangerouslySetInnerHTML={{ __html: 'End' }}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Modal de Historial */}
            <HistoryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                propertyId={selectedPropertyId}
            />
        </div>
    );
};

ListProperties.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Lista de propiedades" />
        {page}
    </AppLayout>
);

export default ListProperties;
