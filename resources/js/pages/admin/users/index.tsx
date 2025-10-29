import { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import LoadingScreen from '@/components/common/loading-screen';
// import UserModal from '@/components/admin/user-modal';
// import UserFilters from '@/components/admin/user-filters';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedData } from '@/types';

interface UserData {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    email_verified_at: string | null;
    roles: Array<{
        id: number;
        name: string;
        label: string;
    }>;
}

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    users: PaginatedData<UserData>;
    roles: Record<string, string>;
    filters: {
        search?: string;
        roles?: string[];
        statuses?: string[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: '/admin/users' },
];

export default function UsersIndex({ auth, users, roles, filters }: PageProps) {
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    const handlePageChange = (url: string) => {
        setLoading(true);
        router.visit(url, {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleFiltersChange = useCallback((newFilters: any) => {
        setLoading(true);
        router.get(route('admin.users.index'), newFilters, {
            preserveState: true,
            replace: true,
            onFinish: () => setLoading(false),
        });
    }, []);

    const handleCreateUser = () => {
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleEditUser = (user: UserData) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleToggleUserStatus = (user: UserData) => {
        setLoading(true);
        router.patch(route('admin.users.toggle-status', user.id), {}, {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleModalSuccess = () => {
        // Recargar la página manteniendo los filtros actuales
        setLoading(true);
        router.get(route('admin.users.index'), filters, {
            preserveState: true,
            replace: true,
            only: ['users'],
            onFinish: () => setLoading(false),
        });
    };

    const getStatusBadge = (isActive: boolean, emailVerified: string | null) => {
        if (!emailVerified) {
            return <Badge variant="destructive">Sin verificar</Badge>;
        }
        if (isActive) {
            return <Badge variant="default">Activo</Badge>;
        }
        return <Badge variant="secondary">Inactivo</Badge>;
    };

    const getRoleBadges = (roles: Array<{ id: number; name: string; label: string }>) => {
        if (roles.length === 0) {
            return <Badge variant="outline">Sin rol</Badge>;
        }

        const roleColors: Record<string, string> = {
            'admin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'super_user': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            'employer': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'recruiter': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'candidate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'interventoria': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        };

        return (
            <div className="flex flex-wrap gap-1">
                {roles.map((role) => {
                    const colorClass = roleColors[role.name] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
                    
                    return (
                        <Badge 
                            key={role.id} 
                            className={`${colorClass} text-xs truncate max-w-[80px]`} 
                            variant="secondary"
                            title={role.label}
                        >
                            {role.label}
                        </Badge>
                    );
                })}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            
            {/* <LoadingScreen loading={loading} label="Cargando usuarios..." /> */}

            <div className="py-4 w-full">
                <div className="w-full mx-auto sm:px-6 lg:px-4">
                    {/* Componente de filtros */}
                    {/* <UserFilters
                        roles={roles}
                        batches={batches}
                        initialFilters={filters}
                        onFiltersChange={handleFiltersChange}
                        loading={loading}
                    /> */}

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Gestión de Usuarios</CardTitle>
                                <CardDescription>
                                    {users.total > 0 ? (
                                        <>Mostrando {users.total} usuario{users.total !== 1 ? 's' : ''} registrado{users.total !== 1 ? 's' : ''}</>
                                    ) : (
                                        'No se encontraron usuarios'
                                    )}
                                </CardDescription>
                            </div>
                            <Link
                                href="/users/create"
                                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
                            >
                                <i className='bi bi-plus-lg'></i>
                                Crear Usuario
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <div className="min-w-[1000px]"> {/* Ancho mínimo para evitar wrap */}
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 w-max">
                                                    Usuario
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 w-max">
                                                    Email
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 w-max">
                                                    Roles
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 w-max">
                                                    Estado
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 w-max">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.data.length > 0 ? (
                                                users.data.map((user: UserData) => (
                                                    <tr
                                                        key={user.id}
                                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                    >
                                                        <td className="py-3 px-4 w-max">
                                                            <div className="min-w-0">
                                                                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    ID: {user.id}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 w-max">
                                                            <div className="text-gray-900 dark:text-gray-100 truncate">
                                                                {user.email}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 w-max">
                                                            <div className="min-w-0">
                                                                {getRoleBadges(user.roles)}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 w-max">
                                                            {getStatusBadge(user.is_active, user.email_verified_at)}
                                                        </td>
                                                        <td className="py-3 px-4 w-max">
                                                            <div className="flex gap-2">
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={() => handleEditUser(user)}
                                                                    disabled={loading}
                                                                    className="whitespace-nowrap"
                                                                >
                                                                    Editar
                                                                </Button>
                                                                <Button 
                                                                    variant={user.is_active ? "destructive" : "default"} 
                                                                    size="sm"
                                                                    onClick={() => handleToggleUserStatus(user)}
                                                                    disabled={loading}
                                                                    className="whitespace-nowrap"
                                                                >
                                                                    {user.is_active ? 'Deshabilitar' : 'Habilitar'}
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                                        {Object.values(filters).some(value => 
                                                            Array.isArray(value) ? value.length > 0 : value !== ''
                                                        ) ? (
                                                            <div className="space-y-2">
                                                                <div>No se encontraron usuarios con los filtros aplicados</div>
                                                                <div className="text-sm">
                                                                    Prueba ajustando los criterios de búsqueda
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            'No hay usuarios registrados'
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Paginación */}
                            {users.total > users.per_page && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Mostrando {users.from} a {users.to} de {users.total} usuarios
                                    </div>
                                    <div className="flex gap-2">
                                        {users.links.map((link: { url: string | null; label: string; active: boolean }, index: number) => {
                                            if (link.url === null) {
                                                return (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        size="sm"
                                                        disabled
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
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Modal de Usuario */}
                    {/* <UserModal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        user={selectedUser}
                        roles={roles}
                        batches={batches}
                        onSuccess={handleModalSuccess}
                    /> */}
                </div>
            </div>
        </AppLayout>
    );
}