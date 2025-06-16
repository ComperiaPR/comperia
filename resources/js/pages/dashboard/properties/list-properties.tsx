import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Propiedades',
        href: '/properties',
    },
];

interface Property {
    id: number;
    name: string;
    address: string;
    description: string;
    state: boolean;
}

const ListProperties = ({ properties }: { properties: Property[] }) => {

    return (
        <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl p-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex min-h-[600px] flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-primary text-2xl font-semibold">Propiedades</h1>
                        <Link
                            href="/properties/create"
                            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white text-sm font-medium shadow hover:bg-primary/90 transition-colors"
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
                                    { properties.length > 0 ? (
                                        properties.map((property) => (
                                        <TableRow key={property.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{property.id}</code>
                                            </TableCell>

                                        <TableCell>{property.name}</TableCell>
                                        <TableCell>{property.address}</TableCell>
                                        <TableCell>{property.state ? 'Activa' : 'Inactiva'}</TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                            {/* Botones individuales para pantallas grandes */}
                                            <div className="hidden sm:flex gap-1">
                                                <Button
                                                variant="ghost"
                                                size="sm"
                                                // onClick={() => handleView(property)}
                                                title="Ver detalles"
                                                className="h-8 w-8 p-0"
                                                >
                                                <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                variant="ghost"
                                                size="sm"
                                                // onClick={() => handleEdit(property)}
                                                title="Editar"
                                                className="h-8 w-8 p-0"
                                                >
                                                <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                variant="ghost"
                                                size="sm"
                                                // onClick={() => handleDelete(property.id)}
                                                title="Eliminar"
                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                                                <code className="text-base px-2 py-1 rounded">No hay propiedades registradas</code>
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
