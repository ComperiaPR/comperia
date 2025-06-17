import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Property } from '@/types/property';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Propiedades',
        href: '/properties',
    },
    {
        title: 'Actualizar propiedad',
        href: '',
    },
];

const UpdateProperty = ({ property }: { property: Property }) => {
    const initialValues = {
        name: property.name,
        address: property.address,
        description:  property.description,
    }

    const { data, setData, put, errors, processing } = useForm(initialValues);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put('/properties/'+property.id, {
            preserveScroll: true,
            onSuccess: () => {
                setData(initialValues);
                toast.success('Propiedad actualizada', {
                    description: 'Los datos de la propiedad han sido actualizados exitosamente.',
                });
            },
            onError: (errorData) => {
                if (errorData.error) {
                    toast.error('Error', {
                        description: errorData.error,
                    });
                }
            }
        });
    }

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 items-center">
            <Card className="w-full max-w-xl shadow-sm border-slate-200 bg-slate-100">
                <CardHeader className="space-y-1.5 relative">

                    <CardTitle className="text-2xl font-semibold text-center text-primary">
                        Actualizar datos de la propiedad
                    </CardTitle>
                    <CardDescription className="text-center text-slate-600">
                        Complete los campos para registrar una nueva propiedad
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2.5">
                            <Label className="text-sm font-medium text-slate-900">Nombre</Label>
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Asigne un nombre a la propiedad"
                                className="bg-white border-slate-200 mt-2"
                                required
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="space-y-2.5">
                            <Label className="text-sm font-medium text-slate-900">Dirección</Label>
                            <Input
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Asigne la dirección de la propiedad"
                                className="bg-white border-slate-200 mt-2"
                                required
                            />
                            <InputError className="mt-2" message={errors.address} />
                        </div>

                        <div className="space-y-2.5">
                            <Label className="text-sm font-medium text-slate-900">Descripción</Label>
                            <Textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Asigne una descripción a la propiedad"
                                className="bg-white border-slate-200 mt-2 rounded-md w-full px-3 py-2 text-sm resize-y min-h-[150px]"
                                required
                            />
                            <InputError className="mt-2" message={errors.description} />
                        </div>

                        <Button type="submit" disabled={processing} className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-11 cursor-pointer">
                            Guardar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

UpdateProperty.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Actualizar propiedad" />
        {page}
    </AppLayout>
);

export default UpdateProperty;
