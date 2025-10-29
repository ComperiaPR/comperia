import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useCallback } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Header } from '../public/components/header';
import SelectElement from '@/components/ui/select-element';
import { Municipality } from '@/types/master-data';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

type RegisterForm = {
    email: string;
    document: string;
    first_name: string;
    last_name: string;
    company_name: string;
    address_main: string;
    address_secondary: string;
    municipality_id: string | null;
    zip_code: string;
    phone_number: string;
    cell_number: string;
    password: string;
    password_confirmation: string;
    avatar?: string;
    role: string;
    account_type: string;
    terms?: boolean;
};

const modelUser: RegisterForm = {
    document: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'client',
    company_name: '',
    address_main: '',
    address_secondary: '',
    municipality_id: '',
    zip_code: '',
    phone_number: '',
    cell_number: '',
    account_type: '',
    terms: false,
};
interface PageProps<T = {}> {
    municipalities: Municipality[];
    account_types: Record<string, string>;
}

export default function Register({
    account_types,
    municipalities,
}: PageProps <{
    account_types: Record<string, string>;
    municipalities: Municipality[];
}>) {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>(modelUser);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if(!data.terms){
            toast.error('Error to register', {
                description: 'You must agree to the terms and conditions to register.',
            });
            return;
        }
        post(route('register'), {
            // onFinish: () => reset('password', 'password_confirmation'),
            onError: () => { 
                toast.error('Error to register', {
                    description: 'There was a problem saving the user data.',
                });
            },
            onSuccess: () => { 
                toast.success('Registered successfully', {
                    description: 'Your account has been created successfully.',
                });
            }
        });
    };

    return (
        <div className="bg-[url('https://comperiapr.com/assets/img/backgrounds/1.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
            <Header />
            <AuthLayout title="Create an account" description="Enter your details below to create your account" type="register">
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
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
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Contraseña"
                                disabled={processing}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} />
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
                        <div className="space-y-2.5">
                            <Label htmlFor="account_type">Account Type</Label>
                            <SelectElement
                                data={Object.entries(account_types).map(([value, label]) => ({ id: value, name: label }))}
                                valueSelected={data.account_type}
                                onChangeEvent={useCallback((newValue: string) => setData('account_type', newValue), [setData])}
                                className="w-full border-slate-200 bg-white"
                            />
                            <InputError message={errors.account_type} className="mt-2" />
                        </div> 
                        <div className="pt-4">
                            <Checkbox
                                id="terms"
                                name="terms"
                                checked={data.terms}
                                onClick={() => setData('terms', !data.terms)}
                                className="border border-gray-300 bg-white"
                            />
                            <Label htmlFor="terms" className="text-sm font-medium text-slate-900">
                                {' '}
                                I have read and agree to the terms and conditions
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                <a 
                                    href="https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                    Read Terms and Conditions
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Button type="submit" className="mt-2 w-full md:max-w-xs xs:w-2xs" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create account
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <TextLink href={route('login')} >
                            Log in
                        </TextLink>
                    </div>
                </form>
            </AuthLayout>
        </div>
    );
}
