import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedData } from '@/types';
import { AuthLog } from '@/types/auth-log';
import { Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Auth Logs', href: '/auth-logs' },
];

interface AuthLogsIndexProps {
    authLogs: PaginatedData<AuthLog>;
    filters: { search?: string };
}

function formatDuration(loginAt: string, logoutAt: string | null): string {
    if (!logoutAt) return '-';

    const minutes = Math.max(0, Math.round((new Date(logoutAt).getTime() - new Date(loginAt).getTime()) / 60000));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

export default function AuthLogsIndex({ authLogs, filters }: AuthLogsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [loading, setLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/auth-logs', {
            search: search || undefined,
        }, {
            preserveState: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        setLoading(true);
        router.visit(url, {
            preserveState: true,
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Auth Logs" />

            <div className="py-4 w-full">
                <div className="w-full mx-auto sm:px-6 lg:px-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Auth Logs</CardTitle>
                            </div>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-64"
                                />
                                <Button type="submit" variant="outline" disabled={loading}>
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="text-xs text-gray-700 bg-gray-50">
                                            <TableHead className="text-xs h-8">#ID</TableHead>
                                            <TableHead className="text-xs h-8">User</TableHead>
                                            <TableHead className="text-xs h-8">Email</TableHead>
                                            <TableHead className="text-xs h-8">IP Address</TableHead>
                                            <TableHead className="text-xs h-8">User Agent</TableHead>
                                            <TableHead className="text-xs h-8">Login At</TableHead>
                                            <TableHead className="text-xs h-8">Logout At</TableHead>
                                            <TableHead className="text-xs h-8">Duration</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {authLogs.data.length > 0 ? (
                                            authLogs.data.map((log) => (
                                                <TableRow key={log.id} className="hover:bg-muted/50">
                                                    <TableCell className="text-xs">
                                                        <code className="rounded bg-muted p-1 font-mono text-xs">{log.id}</code>
                                                    </TableCell>
                                                    <TableCell className="text-xs font-medium">
                                                        {log.user ? `${log.user.first_name} ${log.user.last_name}` : 'Deleted user'}
                                                    </TableCell>
                                                    <TableCell className="text-xs">{log.email}</TableCell>
                                                    <TableCell className="text-xs whitespace-nowrap">{log.ip_address ?? '-'}</TableCell>
                                                    <TableCell className="max-w-xs truncate text-xs" title={log.user_agent ?? ''}>
                                                        {log.user_agent ?? '-'}
                                                    </TableCell>
                                                    <TableCell className="text-xs whitespace-nowrap">
                                                        {new Date(log.login_at).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-xs whitespace-nowrap">
                                                        {log.logout_at ? (
                                                            new Date(log.logout_at).toLocaleString()
                                                        ) : (
                                                            <Badge variant="secondary">Active session</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-xs whitespace-nowrap">
                                                        {formatDuration(log.login_at, log.logout_at)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center">
                                                    <code className="rounded px-2 py-1 text-base">No auth logs found</code>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {authLogs.total > authLogs.per_page && (
                                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="text-xs text-gray-700 dark:text-gray-300">
                                        Showing {authLogs.from} to {authLogs.to} of {authLogs.total} logs
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {authLogs.links.map((link, index) => (
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
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
