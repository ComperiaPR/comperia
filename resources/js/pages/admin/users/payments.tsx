import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Plan } from '@/types/master-data';
import { ArrowLeft } from 'lucide-react';

interface PaymentUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    date_start: string | null;
    date_finish: string | null;
}

interface PaymentType {
    id: number;
    name: string;
}

interface Payment {
    id: number;
    amount: string;
    currency: string;
    status: string | null;
    order_id: string;
    date_start: string;
    date_finish: string;
    created_at: string;
    plan: Plan | null;
    payment_type: PaymentType | null;
}

interface PaymentsProps {
    user: PaymentUser;
    currentPlan: Plan | null;
    payments: Payment[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: '/users' },
    { title: 'Payment History', href: '' },
];

const formatDate = (value: string | null) =>
    value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

const formatCurrency = (amount: string, currency: string) =>
    Number(amount).toLocaleString('en-US', { style: 'currency', currency: currency || 'USD' });

export default function UserPayments({ user, currentPlan, payments }: PaymentsProps) {
    const isExpired = user.date_finish ? new Date(user.date_finish) < new Date() : true;
    const membershipStatus = !user.is_active ? 'Inactive' : isExpired ? 'Expired' : 'Active';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment History" />

            <div className="py-4 w-full">
                <div className="w-full mx-auto sm:px-6 lg:px-4 space-y-4">
                    <Link href="/users" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                        <ArrowLeft className="h-4 w-4" /> Back to users
                    </Link>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {user.first_name} {user.last_name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <div className="text-xs font-medium text-muted-foreground">Status</div>
                                    <div className="mt-1">
                                        <Badge variant={membershipStatus === 'Active' ? 'default' : 'destructive'}>{membershipStatus}</Badge>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <div className="text-xs font-medium text-muted-foreground">Current Plan</div>
                                    <div className="mt-1 text-sm font-semibold">{currentPlan?.name ?? 'No plan'}</div>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <div className="text-xs font-medium text-muted-foreground">Membership expires on</div>
                                    <div className="mt-1 text-sm font-semibold">{formatDate(user.date_finish)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="text-xs text-gray-700 bg-gray-50">
                                            <TableHead className="text-xs h-8">Plan</TableHead>
                                            <TableHead className="text-xs h-8">Amount</TableHead>
                                            <TableHead className="text-xs h-8">Payment Method</TableHead>
                                            <TableHead className="text-xs h-8">Status</TableHead>
                                            <TableHead className="text-xs h-8">Covers</TableHead>
                                            <TableHead className="text-xs h-8">Paid On</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payments.length > 0 ? (
                                            payments.map((payment) => (
                                                <TableRow key={payment.id} className="hover:bg-muted/50">
                                                    <TableCell className="text-xs font-medium">{payment.plan?.name ?? '—'}</TableCell>
                                                    <TableCell className="text-xs">{formatCurrency(payment.amount, payment.currency)}</TableCell>
                                                    <TableCell className="text-xs">{payment.payment_type?.name ?? 'Manual'}</TableCell>
                                                    <TableCell className="text-xs">{payment.status ?? '—'}</TableCell>
                                                    <TableCell className="text-xs whitespace-nowrap">
                                                        {formatDate(payment.date_start)} – {formatDate(payment.date_finish)}
                                                    </TableCell>
                                                    <TableCell className="text-xs whitespace-nowrap">{formatDate(payment.created_at)}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center">
                                                    <code className="rounded px-2 py-1 text-base">No payments found</code>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
