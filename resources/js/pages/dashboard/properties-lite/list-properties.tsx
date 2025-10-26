import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { Property } from '@/types/property';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Propiedades',
        href: '/properties',
    },
];

const ListProperties = ({ properties }: { properties: Property[] }) => {

    const handleDelete = (propertyId: number) => {
        router.delete(route('properties.destroy', propertyId), {
            preserveScroll: true,
        });
    };

    return (
        <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl p-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex min-h-[600px] flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-primary">Propiedades</h1>
                        <Link
                            href="/properties/create"
                            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
                        >
                            Crear propiedad
                        </Link>
                    </div>

                    <div className="flex flex-1 flex-col">
                        <div className="flex-1 overflow-auto">
                            <div className="space-y-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[120px]">ID</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Dirección</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {properties.length > 0 ? (
                                            properties.map((property) => (
                                                <TableRow key={property.id} className="hover:bg-muted/50">
                                                    <TableCell className="font-medium">
                                                        <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{property.id}</code>
                                                    </TableCell>

                                                    <TableCell>{property.name}</TableCell>
                                                    <TableCell>{property.address}</TableCell>
                                                    <TableCell>{property.state ? 'Activa' : 'Inactiva'}</TableCell>

                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <div className="hidden gap-1 sm:flex items-center">
                                                                <Link
                                                                    href={"/properties/"+property.id}
                                                                    className="flex items-center justify-center h-8 w-8 p-0 text-blue-400 hover:bg-blue-400/20 hover:text-blue-400 rounded-md transition-colors"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(property.id)}
                                                                    title="Eliminar"
                                                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </TableCell>
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
                    </div>
                </div>
            </div>
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
