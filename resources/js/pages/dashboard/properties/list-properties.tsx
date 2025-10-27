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
                        <CardTitle>Gestión de Propiedades</CardTitle>
                        <CardDescription>
                            {properties.total > 0 ? (
                                <>Mostrando {properties.total} propiedad{properties.total !== 1 ? 'es' : ''} registrada{properties.total !== 1 ? 's' : ''}</>
                            ) : (
                                'No se encontraron propiedades'
                            )}
                        </CardDescription>
                    </div>
                    <div>
                        <Link
                            href="/properties/create"
                            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
                        >
                            Crear Completa
                        </Link>
                        <Link
                            href="/properties/create-lite"
                            className="ms-2 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
                        >
                            Crear Preliminar
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="space-y-">
                    <div className="overflow-x-auto">
                        <div className="min-w-[1000px]"> {/* Ancho mínimo para evitar wrap */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-left"></TableHead>
                                        <TableHead className="w-">#ID</TableHead>
                                        <TableHead>City</TableHead>
                                        <TableHead>Property Type</TableHead>
                                        <TableHead>Transaction</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Buyer</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Daily</TableHead>
                                        <TableHead>Page Entry</TableHead>
                                        <TableHead>Track</TableHead>
                                        <TableHead>Page(Folio)</TableHead>
                                        <TableHead>Volumen</TableHead>
                                        <TableHead>Inscription</TableHead>
                                        <TableHead>Catastro</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {properties.data.length > 0 ? (
                                        properties.data.map((property : Property) => (
                                            <TableRow key={property.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">                                                    
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="size-10 rounded-full p-1">
                                                            <MoreVertical className="h-4 w-4 text-black" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-auto" align="start">
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
                                                <TableCell className="font-medium">
                                                    <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{property.id}</code>
                                                </TableCell>
                                                <TableCell>{property.municipality?.name}</TableCell>
                                                <TableCell>{property.property_type?.name}</TableCell>
                                                <TableCell>{property.transaction_type?.name}</TableCell>
                                                <TableCell>
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
                                                <TableCell>{property.buyer}</TableCell>
                                                <TableCell>
                                                    {property.price !== undefined && property.price !== null
                                                        ? property.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                                        : ''}
                                                </TableCell>
                                                <TableCell>{property.daily}</TableCell>
                                                <TableCell>{property.page_entry}</TableCell>
                                                <TableCell>{property.track_no}</TableCell>
                                                <TableCell>{property.folio_page}</TableCell>
                                                <TableCell>{property.volumen}</TableCell>
                                                <TableCell>{property.inscription}</TableCell>
                                                <TableCell>{property.cadastre}</TableCell>
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
                                Mostrando {properties.from} a {properties.to} de {properties.total} propiedades
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {/* Botón ir al inicio */}
                                <Button
                                    variant='outline'
                                    size="sm"
                                    onClick={() => handlePageChange(properties.links[1]?.url ?? '')}
                                    disabled={loading || !properties.links[1]?.url}
                                    dangerouslySetInnerHTML={{ __html: 'Inicio' }}
                                />
                                {properties.links.map((link: { url: string | null; label: string; active: boolean }, index: number) => {
                                    if (link.url === null) {
                                        return (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                disabled
                                                className="xs:inline-flex"
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
                                            className="xs:inline-flex"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                                {/* Botón ir al final */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(properties.links[properties.links.length - 2]?.url ?? '')}
                                    disabled={loading || !properties.links[properties.links.length - 2]?.url}
                                    dangerouslySetInnerHTML={{ __html: 'Fin' }}
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
