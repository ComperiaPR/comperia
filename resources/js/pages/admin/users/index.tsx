import { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import LoadingScreen from '@/components/common/loading-screen';
// import UserModal from '@/components/admin/user-modal';
import UserFilters from '@/pages/admin/components/user-filters';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedData, User } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Eye, FileSpreadsheet, MoreVertical, Settings, Trash2, UserCheck2, UserPen, UserPlus2, UserRoundPen, UserX2 } from 'lucide-react';

interface PageProps {
    auth: {
        user: User[];
    };
    users: PaginatedData<User>;
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
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handlePageChange = (url: string) => {
        setLoading(true);
        router.visit(url, {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleFiltersChange = useCallback((newFilters: any) => {
        setLoading(true);
        router.get(route('users.index'), newFilters, {
            preserveState: true,
            replace: true,
            onFinish: () => setLoading(false),
        });
    }, []);

    const handleCreateUser = () => {
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleToggleUserStatus = (user_id: number) => {
        setLoading(true);
        router.patch(route('users.toggle-status', user_id), {}, {
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

    const getTypeAccountBadge = (typeAccount: string) => {
        if (['individual'].includes(typeAccount)) {
            return <Badge 
                        className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        variant="default">Individual</Badge>;
        }else if (typeAccount === 'corporate') {
            return <Badge 
                        className='bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                        variant="destructive">Corporate</Badge>;
        }
        return <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                        variant="secondary">Sin tipo</Badge>;
    };

    const getRoleBadges = (roles: Array<{ id: number; name: string; label: string }>) => {
        if (roles.length === 0) {
            return <Badge variant="outline">Sin rol</Badge>;
        }

        const roleColors: Record<string, string> = {
            'admin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'super_user': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            'editor': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'client': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        };

        return (
           <>
                {roles.map((role) => {
                    const colorClass = roleColors[role.name] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
                    
                    return (
                        <Badge 
                            key={role.id} 
                            className={`${colorClass} text-xs truncate`} 
                            variant="secondary"
                            title={role.label}
                        >
                            {role.label}
                        </Badge>
                    );
                })}
            </>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            
            {/* <LoadingScreen loading={loading} label="Cargando usuarios..." /> */}

            <div className="py-4 w-full">
                <div className="w-full mx-auto sm:px-6 lg:px-4">
                    {/* Componente de filtros */}
                    <UserFilters
                        roles={roles}
                        initialFilters={filters}
                        onFiltersChange={handleFiltersChange}
                        loading={loading}
                    />

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>
                                    {users.total > 0 ? (
                                        <>Showing {users.total} user{users.total !== 1 ? 's' : ''} registered{users.total !== 1 ? 's' : ''}</>
                                    ) : (
                                        'Not users found'
                                    )}
                                </CardDescription>
                            </div>
                            <div>
                                <Link
                                    href="/users/create"
                                    className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90"
                                >
                                    <UserPlus2 className="mr-2 h-4 w-4" /> Create User
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <div className="min-w-[1000px]"> {/* Ancho mínimo para evitar wrap */}
                                    <Table>
                                        <TableHeader className='p-0 m-0'>
                                            <TableRow className='text-xs text-gray-700 bg-gray-50 p-0 m-0'>
                                                <TableHead className="text-left text-xs h-8"></TableHead>
                                                <TableHead className="w- text-xs h-8">#ID</TableHead>
                                                <TableHead className="text-xs h-8">Name</TableHead>
                                                <TableHead className="text-xs h-8">Company Name</TableHead>
                                                <TableHead className="text-xs h-8">PostAddr1</TableHead>
                                                <TableHead className="text-xs h-8">PostAddr2</TableHead>
                                                <TableHead className="text-xs h-8">Municipality</TableHead>
                                                <TableHead className="text-xs h-8">Movil</TableHead>
                                                <TableHead className="text-xs h-8">Email</TableHead>
                                                <TableHead className="text-xs h-8">Type</TableHead>
                                                <TableHead className="text-xs h-8">Role</TableHead>
                                                <TableHead className="text-xs h-8">Status</TableHead>
                                                <TableHead className="text-xs h-8">Initial</TableHead>
                                                <TableHead className="text-xs h-8">Finish</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.data.length > 0 ? (
                                                users.data.map((user: User) => (
                                                    <TableRow
                                                        key={user.id}
                                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                    >
                                                        <TableCell className="font-medium text-xs p-0">                                                    
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="size-8 rounded-full p-0">
                                                                    <MoreVertical className="h-4 w-4 text-black" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="w-auto" align="start">
                                                                {/* <DropdownMenuItem asChild>
                                                                    <Link
                                                                        href={"/users/view/"+user.id}
                                                                        className="flex items-start justify-start w-full px-3 py-2 text-sm text-green-400 hover:bg-gray-100 bg-default"
                                                                    >
                                                                        <Eye className="h-4 w-4 text-green-400" /> Ver
                                                                    </Link>
                                                                </DropdownMenuItem> */}
                                                                <DropdownMenuItem asChild>
                                                                    <Link
                                                                        href={"/users/"+user.id}
                                                                        className="flex items-start justify-start w-full px-3 py-2 text-sm text-blue-400 hover:bg-gray-100 bg-default"
                                                                    >
                                                                        <UserRoundPen className="h-4 w-4 text-blue-400" /> Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Button
                                                                        variant={user.is_active ? "destructive" : "default"} 
                                                                        onClick={() => handleToggleUserStatus(user.id ?? 0)}
                                                                        className={`flex items-start justify-start w-full px-4 py-2 text-sm hover:bg-gray-100 bg-default ${user.is_active ? 'text-red-600' : 'text-green-600'}`}
                                                                    >   
                                                                        {user.is_active ? (
                                                                            <>
                                                                                <UserX2 className={`h-4 w-4 text-red-600`} />  Inactivate
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <UserCheck2 className={`h-4 w-4 text-green-600`} />  Activate
                                                                            </>
                                                                        )}
                                                                    </Button>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        </TableCell>
                                                        <TableCell className="font-medium p-0 text-xs">
                                                            <code className="rounded bg-muted p-0 p-1 font-mono text-xs">{user.id}</code>
                                                        </TableCell>
                                                        <TableCell className="p-0 text-xs">{user.first_name} {user.last_name}</TableCell>
                                                        <TableCell className="p-0 text-xs">{user.company_name}</TableCell>
                                                        <TableCell className="p-0 text-xs">{user.address_main}</TableCell>
                                                        <TableCell className="p-0 text-xs">{user.address_secondary}</TableCell>
                                                        <TableCell className="p-0 text-xs">{user.municipality?.name}</TableCell>
                                                        <TableCell className="p-0 text-xs">{user.cell_number} - {user.phone_number}</TableCell>
                                                        <TableCell className="p-0 text-xs">{user.email}</TableCell>
                                                        <TableCell className="p-0 text-xs">{getTypeAccountBadge(user.account_type)}</TableCell>
                                                        <TableCell className="p-0 text-xs">{getRoleBadges(user.roles)}</TableCell>
                                                        <TableCell className="p-0 text-xs">{getStatusBadge(user.is_active, user.email_verified_at)}</TableCell>
                                                        <TableCell className="p-0 text-xs text-end">{user.date_start ?? '-'}</TableCell>
                                                        <TableCell className="p-0 text-xs text-end">{user.date_finish ?? '-'}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center">
                                                        <code className="rounded px-2 py-1 text-base">There are no registered users</code>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Paginación */}
                            {users.total > users.per_page && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing {users.from} to {users.to} of {users.total} users
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