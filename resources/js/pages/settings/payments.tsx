import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payments',
        href: '/settings/payments',
    },
];

interface Plan {
    id: number;
    name: string;
    description: string | null;
    price: number;
    days: number;
    type_plan: string;
}

interface PaymentType {
    id: number;
    name: string;
}

interface LastPayment {
    id: number;
    // Serialized as a string because the backend casts it as decimal:2
    amount: string;
    currency: string;
    status: string | null;
    date_start: string;
    date_finish: string;
    created_at: string;
    plan: Plan | null;
    payment_type: PaymentType | null;
}

interface Membership {
    is_active: boolean;
    date_start: string | null;
    date_finish: string | null;
}

interface PaymentsProps {
    membership: Membership;
    lastPayment: LastPayment | null;
}

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—');

const formatCurrency = (amount: string, currency: string) =>
    Number(amount).toLocaleString('en-US', { style: 'currency', currency: currency || 'USD' });

export default function Payments({ membership, lastPayment }: PaymentsProps) {
    const isExpired = membership.date_finish ? new Date(membership.date_finish) < new Date() : true;
    const membershipStatus = !membership.is_active ? 'Inactive' : isExpired ? 'Expired' : 'Active';
    const statusVariant = membershipStatus === 'Active' ? 'default' : 'destructive';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Membership" description="Your current membership status and expiration date" />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-slate-200 p-4">
                            <div className="text-xs font-medium text-muted-foreground">Status</div>
                            <div className="mt-1">
                                <Badge variant={statusVariant}>{membershipStatus}</Badge>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 p-4">
                            <div className="text-xs font-medium text-muted-foreground">Plan</div>
                            <div className="mt-1 text-sm font-semibold">{lastPayment?.plan?.name ?? 'No plan'}</div>
                        </div>

                        <div className="rounded-lg border border-slate-200 p-4">
                            <div className="text-xs font-medium text-muted-foreground">Membership expires on</div>
                            <div className="mt-1 text-sm font-semibold">{formatDate(membership.date_finish)}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <HeadingSmall title="Last payment" description="Details of your most recent payment" />

                    {lastPayment ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-lg border border-slate-200 p-4">
                                <div className="text-xs font-medium text-muted-foreground">Amount</div>
                                <div className="mt-1 text-sm font-semibold">{formatCurrency(lastPayment.amount, lastPayment.currency)}</div>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <div className="text-xs font-medium text-muted-foreground">Payment method</div>
                                <div className="mt-1 text-sm font-semibold">{lastPayment.payment_type?.name ?? '—'}</div>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <div className="text-xs font-medium text-muted-foreground">Status</div>
                                <div className="mt-1 text-sm font-semibold">{lastPayment.status ?? '—'}</div>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <div className="text-xs font-medium text-muted-foreground">Payment date</div>
                                <div className="mt-1 text-sm font-semibold">{formatDate(lastPayment.created_at)}</div>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <div className="text-xs font-medium text-muted-foreground">Covers</div>
                                <div className="mt-1 text-sm font-semibold">
                                    {formatDate(lastPayment.date_start)} – {formatDate(lastPayment.date_finish)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No payments found yet.</p>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
