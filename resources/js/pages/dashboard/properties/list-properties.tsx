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
        title: 'Properties',
        href: '/properties',
    },
];

const ListProperties = ({ properties }: { properties: PaginatedData<Property> }) => {

    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

    const handlePageChange = (url: string) => {
        setLoading(true);
        router.visit(url, {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleDelete = (propertyId: number) => {
        router.delete(route('properties.destroy', propertyId), {
            preserveScroll: true,
        });
    };
    
    const handleHistory = (propertyId: number) => {
        // router.get(route('properties.history', propertyId), {
        //     preserveScroll: true,
        // });
        setSelectedPropertyId(propertyId);
        setModalOpen(true);
    };

    return (
        <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl p-4">
            <Card className="w-full border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Property Management</CardTitle>
                        {/* <CardDescription>
                            {properties.total > 0 ? (
                                <>Mostrando {properties.total} propiedad{properties.total !== 1 ? 'es' : ''} registrada{properties.total !== 1 ? 's' : ''}</>
                            ) : (
                                'No se encontraron propiedades'
                            )}
                        </CardDescription> */}
                    </div>
                    <div>
                        <Link
                            href="/properties/create"
                            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
                        >
                            Create Complete
                        </Link>
                        <Link
                            href="/properties/create-lite"
                            className="ms-2 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
                        >
                            Create Preliminary
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="space-y-">
                    <div className="overflow-x-auto">
                        <div className="min-w-[1000px]"> {/* Ancho mínimo para evitar wrap */}
                            <Table>
                                <TableHeader className='p-0 m-0'>
                                    <TableRow className='text-xs text-gray-700 bg-gray-50 p-0 m-0'>
                                        <TableHead className="text-left text-xs h-8"></TableHead>
                                        <TableHead className="w- text-xs h-8">#ID</TableHead>
                                        <TableHead className="text-xs h-8">Municipality</TableHead>
                                        <TableHead className="text-xs h-8">Property Type</TableHead>
                                        <TableHead className="text-xs h-8">Transaction</TableHead>
                                        <TableHead className="text-xs h-8">Date</TableHead>
                                        <TableHead className="text-xs h-8">Buyer</TableHead>
                                        <TableHead className="text-xs h-8">Price</TableHead>
                                        <TableHead className="text-xs h-8">Daily</TableHead>
                                        <TableHead className="text-xs h-8">Page Entry</TableHead>
                                        <TableHead className="text-xs h-8">Track</TableHead>
                                        <TableHead className="text-xs h-8">Page(Folio)</TableHead>
                                        <TableHead className="text-xs h-8">Volumen</TableHead>
                                        <TableHead className="text-xs h-8">Inscription</TableHead>
                                        <TableHead className="text-xs h-8">Catastro</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {properties.data.length > 0 ? (
                                        properties.data.map((property : Property) => (
                                            <TableRow key={property.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium text-xs p-0">                                                    
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="size-8 rounded-full p-0">
                                                            <MoreVertical className="h-4 w-4 text-black" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-auto" align="start">
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={"/properties/view/"+property.id}
                                                                className="flex items-start justify-start w-full px-3 py-2 text-sm text-green-400 hover:bg-gray-100 bg-default"
                                                            >
                                                                <Eye className="h-4 w-4 text-green-400" /> Ver
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={"/properties/"+property.id}
                                                                className="flex items-start justify-start w-full px-3 py-2 text-sm text-blue-400 hover:bg-gray-100 bg-default"
                                                            >
                                                                <Edit className="h-4 w-4 text-blue-400" /> Editar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Button
                                                                disabled
                                                                onClick={() => handleDelete(property.id ?? 0)}
                                                                className="flex items-start justify-start w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 bg-default"
                                                            >
                                                               <Trash2 className="h-4 w-4 text-red-600" /> Eliminar
                                                            </Button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Button
                                                                disabled
                                                                onClick={() => handleDelete(property.id ?? 0)}
                                                                className="flex items-start justify-start w-full px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 bg-default"
                                                            >
                                                               <Eye className="h-4 w-4 text-blue-500" /> Detail
                                                            </Button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Button
                                                                disabled
                                                                onClick={() => handleDelete(property.id ?? 0)}
                                                                className="flex items-start justify-start w-full px-4 py-2 text-sm text-rose-800 hover:bg-gray-100 bg-default"
                                                            >
                                                               <Building2 className="h-4 w-4 text-rose-800" /> Taxes
                                                            </Button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Button
                                                                disabled
                                                                onClick={() => handleHistory(property.id ?? 0)}
                                                                className="flex items-start justify-start w-full px-4 py-2 text-sm text-fuchsia-700 hover:bg-gray-100 bg-default"
                                                            >
                                                               <ListOrdered className="h-4 w-4 text-fuchsia-700" /> History
                                                            </Button>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                </TableCell>
                                                <TableCell className="font-medium p-0 text-xs">
                                                    <code className="rounded bg-muted p-0 p-1 font-mono text-xs">{property.id}</code>
                                                </TableCell>
                                                <TableCell className="p-0 text-xs">{property.municipality?.name}</TableCell>
                                                <TableCell className="p-0 text-xs">{property.property_type?.name}</TableCell>
                                                <TableCell className="p-0 text-xs">{property.transaction_type?.name}</TableCell>
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
                                                <TableCell className='p-0 text-xs'>{property.buyer}</TableCell>
                                                <TableCell className='p-0 text-xs'>
                                                    {property.price !== undefined && property.price !== null
                                                        ? property.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                                        : ''}
                                                </TableCell>
                                                <TableCell className='p-0 text-xs'>{property.daily}</TableCell>
                                                <TableCell className='p-0 text-xs'>{property.page_entry}</TableCell>
                                                <TableCell className='p-0 text-xs'>{property.track_no}</TableCell>
                                                <TableCell className='p-0 text-xs'>{property.folio_page}</TableCell>
                                                <TableCell className='p-0 text-xs'>{property.volumen}</TableCell>
                                                <TableCell className='p-0 text-xs'>{property.inscription}</TableCell>
                                                <TableCell className='p-0 text-xs'>{property.cadastre}</TableCell>
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
                    </div>

                    {/* Paginación */}
                    {properties.total > properties.per_page && (
                        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {properties.from} to {properties.to} of {properties.total} properties
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {/* Botón ir al inicio */}
                                <Button
                                    variant='outline'
                                    size="sm"
                                    className='text-xs'
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
