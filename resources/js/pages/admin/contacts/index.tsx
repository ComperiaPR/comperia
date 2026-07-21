import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SelectElement from '@/components/ui/select-element';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedData } from '@/types';
import { ContactMessage } from '@/types/contact-message';
import { Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Contact Messages', href: '/contacts' },
];

const TYPE_OPTIONS = [
    { id: 'all', name: 'All types' },
    { id: 'contact', name: 'Contact' },
    { id: 'improvement', name: 'Improvement' },
];

interface ContactsIndexProps {
    messages: PaginatedData<ContactMessage>;
    filters: { search?: string; type?: string };
}

export default function ContactsIndex({ messages, filters }: ContactsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [type, setType] = useState(filters.type ?? 'all');
    const [loading, setLoading] = useState(false);

    const applyFilters = (nextType: string) => {
        router.get('/contacts', {
            search: search || undefined,
            type: nextType !== 'all' ? nextType : undefined,
        }, {
            preserveState: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(type);
    };

    const handleTypeChange = (newValue: string | number) => {
        const value = newValue.toString();
        setType(value);
        applyFilters(value);
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
            <Head title="Contact Messages" />

            <div className="py-4 w-full">
                <div className="w-full mx-auto sm:px-6 lg:px-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Contact Messages</CardTitle>
                            </div>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <SelectElement
                                    data={TYPE_OPTIONS}
                                    valueSelected={type}
                                    onChangeEvent={handleTypeChange}
                                    className="w-40 border-slate-200 bg-white"
                                />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, email, subject..."
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
                                            <TableHead className="text-xs h-8">Type</TableHead>
                                            <TableHead className="text-xs h-8">Name</TableHead>
                                            <TableHead className="text-xs h-8">Email</TableHead>
                                            <TableHead className="text-xs h-8">Property</TableHead>
                                            <TableHead className="text-xs h-8">Subject / Improvement</TableHead>
                                            <TableHead className="text-xs h-8">Message</TableHead>
                                            <TableHead className="text-xs h-8">Sent By</TableHead>
                                            <TableHead className="text-xs h-8">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {messages.data.length > 0 ? (
                                            messages.data.map((message) => (
                                                <TableRow key={message.id} className="hover:bg-muted/50">
                                                    <TableCell className="text-xs">
                                                        <code className="rounded bg-muted p-1 font-mono text-xs">{message.id}</code>
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        <Badge variant={message.type === 'improvement' ? 'secondary' : 'default'}>
                                                            {message.type === 'improvement' ? 'Improvement' : 'Contact'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs font-medium">{message.name}</TableCell>
                                                    <TableCell className="text-xs">{message.email}</TableCell>
                                                    <TableCell className="text-xs">
                                                        {message.property ? (
                                                            <Link
                                                                href={'/properties/view/' + message.property.id}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                #{message.property.id} {message.property.street}
                                                            </Link>
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        {message.type === 'improvement' ? (message.improvement_type_label || '-') : (message.subject || '-')}
                                                    </TableCell>
                                                    <TableCell className="max-w-md whitespace-pre-wrap text-xs">{message.message}</TableCell>
                                                    <TableCell className="text-xs">
                                                        {message.user ? `${message.user.first_name} ${message.user.last_name}` : 'Guest'}
                                                    </TableCell>
                                                    <TableCell className="text-xs whitespace-nowrap">
                                                        {new Date(message.created_at).toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={9} className="text-center">
                                                    <code className="rounded px-2 py-1 text-base">No contact messages found</code>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {messages.total > messages.per_page && (
                                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="text-xs text-gray-700 dark:text-gray-300">
                                        Showing {messages.from} to {messages.to} of {messages.total} messages
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {messages.links.map((link, index) => (
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
