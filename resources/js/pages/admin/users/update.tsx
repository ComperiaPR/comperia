import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useCallback } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import AuthMultiSelect from '@/components/ui/auth-multiselect';
import SelectElement from '@/components/ui/select-element';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Municipality, Plan } from '@/types/master-data';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

interface LastPayment {
    id: number;
    date_start: string;
    date_finish: string;
    amount: string;
    status: string | null;
    plan: Plan | null;
}

interface PageProps<T = {}> {
    auth: {
        user: User;
    };
    roles: Record<string, string>;
    user: User;
    municipalities: Municipality[];
    account_types: Record<string, string>;
    plans: Plan[];
    lastPayment: LastPayment | null;
    // Other props can be added here
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/users' }, { title: 'Edit Users', href: '' }];

export default function CreateUser({
    auth,
    roles,
    user,
    account_types,
    municipalities,
    plans,
    lastPayment,
}: PageProps<{
    roles: Record<string, string>;
    user: User;
    account_types: Record<string, string>;
    municipalities: Municipality[];
    plans: Plan[];
    lastPayment: LastPayment | null;
}>) {
    let loading: boolean = false;
    const { data, setData, put, processing, errors } = useForm({
        ...user,
        password: '',
        password_confirmation: '',
        plan_id: '',
        add_payment: false,
    });
    // setData('password', '');
    // setData('password_confirmation', '');

    // Hooks must always run in the same order, so these can't live inside the
    // conditionally-rendered "role === client" / "add_payment" blocks.
    const handleAccountTypeChange = useCallback((newValue: string) => setData('account_type', newValue), [setData]);
    const handlePlanChange = useCallback((newValue: string | number) => setData('plan_id', newValue.toString()), [setData]);
    // console.info('Roles disponibles:', municipalities);

    const clearForm = () => {
        setData('document', '');
        setData('first_name', '');
        setData('last_name', '');
        setData('company_name', '');
        setData('email', '');
        setData('password', '');
        setData('password_confirmation', '');
        setData('zip_code', '');
        setData('address_main', '');
        setData('address_secondary', '');
        setData('municipality_id', '');
        setData('phone_number', '');
        setData('cell_number', '');
        setData('date_start', '');
        setData('date_finish', '');
        setData('role', '');
        setData('account_type', '');
        setData('plan_id', '');
        setData('add_payment', false);
    };

    const toggleAddPayment = (checked: boolean) => {
        setData('add_payment', checked);
        if (checked && lastPayment) {
            // Suggest a start date right after the current payment ends (editable).
            setData('date_start', lastPayment.date_finish);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        loading = true;
        // put('/properties/'+property.id, {
        put('/users/'+ data.id, {
            onSuccess: () => {
                toast.success('User updated', {
                    description: 'User data has been successfully updated.',
                });
                clearForm();
            },
            onFinish: () => {
                loading = false;
            },
            onError: () => {
                toast.error('Error updating user', {
                    description: 'There was a problem saving the user data.',
                });
                loading = false;
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update User" />

            <div className="py-4">
                <div className="mx-auto w-full sm:px-6 lg:px-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Update User</CardTitle>
                            <CardDescription>Complete the form to update the user.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit}>
                                {/* [Information Basic] */}
                                <div className="mx-0 my-0 grid grid-cols-1">
                                    <div className="mx-auto w-full overflow-hidden rounded-md border border-blue-500">
                                        {/* Header */}
                                        <div className="w-full bg-blue-600 px-4 py-2 font-semibold text-white">[Information Basic]</div>
                                        {/* Content */}
                                        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
                                            <div>
                                                <Label htmlFor="document">Identification</Label>
                                                <Input
                                                    id="document"
                                                    type="text"
                                                    value={data.document}
                                                    onChange={(e) => setData('document', e.target.value)}
                                                    placeholder="Identification"
                                                    disabled={processing}
                                                />
                                                <InputError message={errors.document} className="mt-2" />
                                            </div>
                                            <div>
                                                <Label htmlFor="first_name">First Name</Label>
                                                <Input
                                                    id="first_name"
                                                    type="text"
                                                    value={data.first_name}
                                                    onChange={(e) => setData('first_name', e.target.value)}
                                                    placeholder="First Name"
                                                    disabled={processing}
                                                />
                                                <InputError message={errors.first_name} className="mt-2" />
                                            </div>
                                            <div>
                                                <Label htmlFor="last_name">Last Name</Label>
                                                <Input
                                                    id="last_name"
                                                    type="text"
                                                    value={data.last_name}
                                                    onChange={(e) => setData('last_name', e.target.value)}
                                                    placeholder="Last Name"
                                                    disabled={processing}
                                                />
                                                <InputError message={errors.last_name} className="mt-2" />
                                            </div>
                                            <div>
                                                <Label htmlFor="company_name">Business Name</Label>
                                                <Input
                                                    id="company_name"
                                                    type="text"
                                                    value={data.company_name}
                                                    onChange={(e) => setData('company_name', e.target.value)}
                                                    placeholder="Business Name"
                                                    disabled={processing}
                                                />
                                                <InputError message={errors.company_name} className="mt-2" />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="Correo electrónico"
                                                    disabled={processing}
                                                />
                                                <InputError message={errors.email} className="mt-2" />
                                            </div>
                                            <div>
                                                <Label htmlFor="password">Nueva Contraseña (opcional)</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    autoComplete="new-password"
                                                    value={data.password ?? ''}
                                                    onChange={(e) => setData('password', e.target.value ?? '')}
                                                    placeholder="Dejar en blanco para mantener la actual"
                                                    disabled={processing}
                                                />
                                                <InputError message={errors.password} className="mt-2" />
                                            </div>
                                            <div>
                                                <Label htmlFor="password_confirmation">Confirmar Nueva Contraseña</Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    autoComplete="new-password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Dejar en blanco para mantener la actual"
                                                    disabled={processing}
                                                />
                                                <InputError message={errors.password_confirmation} className="mt-2" />
                                            </div>
                                            <div>
                                                <Label htmlFor="address_main">Postal Address Main</Label>
                                                <Input
                                                    id="address_main"
                                                    type="text"
                                                    value={data.address_main}
                                                    onChange={(e) => setData('address_main', e.target.value)}
                                                    placeholder="Postal Address Main"
                                                    disabled={processing}
                                                />
                                                <InputError message={errors.address_main} className="mt-2" />
                                            </div>
                                            <div>
                                                <Label htmlFor="address_secondary">Postal Address Secondary</Label>
                                                <Input
                                                    id="address_secondary"
                                                    type="text"
                                                    value={data.address_secondary}
                                                    onChange={(e) => setData('address_secondary', e.target.value)}
                                                    placeholder="Postal Address Secondary"
                                                    disabled={processing}
                                                />
                                                <InputError message={errors.address_secondary} className="mt-2" />
                                            </div>
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900" htmlFor="state">
                                                    Municipality
                                                </Label>
                                                <SelectElement
                                                    data={municipalities}
                                                    valueSelected={data.municipality_id?.toString() ?? ''}
                                                    onChangeEvent={useCallback(
                                                        (newValue: number | string) => {
                                                            setData('municipality_id', newValue.toString());
                                                        },
                                                        [setData],
                                                    )}
                                                    className="w-full border-slate-200 bg-white"
                                                />
                                                <InputError className="mt-1" message={errors.municipality_id} />
                                            </div>
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900">Zip Code</Label>
                                                <Input
                                                    value={data.zip_code ?? ''}
                                                    onChange={(e) => setData('zip_code', e.target.value)}
                                                    placeholder="Zip Code"
                                                    className="w-full border-slate-200 bg-white"
                                                />
                                                <InputError className="mt-2" message={errors.zip_code} />
                                            </div>
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900">Phone Number</Label>
                                                <Input
                                                    value={data.phone_number ?? ''}
                                                    onChange={(e) => setData('phone_number', e.target.value)}
                                                    placeholder="Phone Number"
                                                    className="w-full border-slate-200 bg-white"
                                                />
                                                <InputError className="mt-2" message={errors.phone_number} />
                                            </div>
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900">Cell Number</Label>
                                                <Input
                                                    value={data.cell_number ?? ''}
                                                    onChange={(e) => setData('cell_number', e.target.value)}
                                                    placeholder="Cell Number"
                                                    className="w-full border-slate-200 bg-white"
                                                />
                                                <InputError className="mt-2" message={errors.cell_number} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* [Membership] */}
                                <div className="mx-0 my-2.5 grid grid-cols-1 gap-4">
                                    <div className="mx-auto w-full overflow-hidden rounded-md border border-blue-500">
                                        {/* Header */}
                                        <div className="w-full bg-blue-600 px-4 py-2 font-semibold text-white">[Membership]</div>
                                        {/* Content */}
                                        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
                                            <div>
                                                <Label htmlFor="role">Rol</Label>
                                                <SelectElement
                                                    data={Object.entries(roles).map(([value, label]) => ({ id: value, name: label }))}
                                                    valueSelected={data.role}
                                                    onChangeEvent={useCallback((newValue: string) => setData('role', newValue), [setData])}
                                                    className="w-full border-slate-200 bg-white"
                                                />
                                                <InputError message={errors.role} className="mt-2" />
                                            </div>
                                        </div>

                                        {/* Payment plan: only relevant for the Client role */}
                                        {data.role === 'client' && (
                                            <div className="space-y-4 border-t border-blue-200 p-4">
                                                {lastPayment && (
                                                    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                                        Current plan: <strong>{lastPayment.plan?.name ?? '—'}</strong> · expires{' '}
                                                        <strong>{new Date(lastPayment.date_finish).toLocaleDateString()}</strong>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
                                                    <div>
                                                        <Label htmlFor="account_type">Account Type</Label>
                                                        <SelectElement
                                                            data={Object.entries(account_types).map(([value, label]) => ({ id: value, name: label }))}
                                                            valueSelected={data.account_type}
                                                            onChangeEvent={handleAccountTypeChange}
                                                            className="w-full border-slate-200 bg-white"
                                                        />
                                                        <InputError message={errors.account_type} className="mt-2" />
                                                    </div>
                                                    <div className="space-y-2.5">
                                                        <Label htmlFor="date_start">Start Date</Label>
                                                        <input
                                                            type="date"
                                                            max={data.date_finish ? new Date(data.date_finish).toISOString().split('T')[0] : undefined}
                                                            value={data.date_start ? new Date(data.date_start).toISOString().split('T')[0] : ''}
                                                            onChange={(date) => setData('date_start', date.target.value)}
                                                            className="w-full rounded-md border-slate-200 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                        />
                                                        <InputError className="mt-1" message={errors.date_start} />
                                                    </div>
                                                    <div className="space-y-2.5">
                                                        <Label htmlFor="date_finish">End Date</Label>
                                                        <input
                                                            type="date"
                                                            min={data.date_start ? new Date(data.date_start).toISOString().split('T')[0] : undefined}
                                                            value={data.date_finish ? new Date(data.date_finish).toISOString().split('T')[0] : ''}
                                                            onChange={(date) => setData('date_finish', date.target.value)}
                                                            className="w-full rounded-md border-slate-200 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                        />
                                                        <InputError className="mt-1" message={errors.date_finish} />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id="add_payment"
                                                        checked={data.add_payment}
                                                        onCheckedChange={(checked) => toggleAddPayment(checked === true)}
                                                    />
                                                    <Label htmlFor="add_payment" className="text-sm font-medium text-slate-900">
                                                        Register a new payment for this period
                                                    </Label>
                                                </div>

                                                {data.add_payment && (
                                                    <div>
                                                        <Label htmlFor="plan_id">Payment Plan</Label>
                                                        <SelectElement
                                                            data={plans.map((plan) => ({ id: plan.id, name: `${plan.name} — $${plan.price} (${plan.days}d)` }))}
                                                            valueSelected={data.plan_id?.toString() ?? ''}
                                                            onChangeEvent={handlePlanChange}
                                                            className="w-full border-slate-200 bg-white sm:max-w-sm"
                                                        />
                                                        <InputError message={errors.plan_id} className="mt-2" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
