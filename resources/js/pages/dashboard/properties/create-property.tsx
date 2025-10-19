import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import SelectElement from '@/components/ui/select-element';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { Municipality, PropertyStatus } from '@/types/master-data';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {CustomAccordion,AccordionItem,AccordionTrigger,AccordionContent} from '@/components/ui/accordion-full';
import { CalendarIcon } from 'lucide-react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Propiedades',
        href: '/properties',
    },
    {
        title: 'Crear propiedad',
        href: '',
    },
];

interface MasterDataProps {
    municipalities: Municipality[]
    property_statuses: PropertyStatus[]
}

const CreateProperty = (masterData: MasterDataProps) => {
    const initialValues = {
        id: '',
        daily: '',
        page_entry: '',
        track_no: '',
        municipality_id: '',
        property_status_id: '',
        registry: '',
        deed_no: '',
        sale_date: Date(),

    }
    
    const { data, setData, post, errors, processing } = useForm(initialValues);

    // errores de validación del lado del cliente
    const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({});
    
    // validators centralizados
    const validators = useMemo(() => ({
        // acepta solo dígitos (permite vacío). Si quieres hacerlo obligatorio, valida en otro lugar.
        daily: (v: unknown) => (/^\d*$/.test(String(v)) ? null : 'Daily debe contener solo dígitos.'),
        // añadir más reglas si es necesario:
        // page_entry: (v) => v ? null : 'Page entry requerido.',
    }), []);
    
    // valida un campo y actualiza clientErrors
    const validateField = useCallback((name: string): string | null => {
        const rule = (validators as any)[name];
        if (!rule) {
            // no hay validación definida para este campo
            setClientErrors((prev) => ({ ...prev, [name]: undefined }));
            return null;
        }
        const err = rule((data as any)[name]);
        setClientErrors((prev) => ({ ...prev, [name]: err || undefined }));
        return err;
    }, [data, validators]);
    
    // valida todos los campos con reglas y devuelve true si hay errores
    const validateAll = useCallback(() => {
        const newErrors: Record<string, string> = {};
        Object.keys(validators).forEach((key) => {
            const err = (validators as any)[key]((data as any)[key]);
            if (err) newErrors[key] = err;
        });
        setClientErrors((prev) => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length > 0;
    }, [data, validators]);
    
    // helper genérico para cambios: setData + limpiar error de campo
    const handleChange = useCallback((name: string, value: any) => {
        setData(name as any, value);
        setClientErrors((prev) => ({ ...prev, [name]: undefined }));
    }, [setData]);

    const isStartDateValid = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date > today) return false;
        return true;
    };
    
    // sincronizar errores de servidor con los errores cliente (para mostrarlos)
    useEffect(() => {
        if (errors && Object.keys(errors).length) {
            setClientErrors((prev) => ({ ...prev, ...(errors as Record<string, string>) }));
        }
    }, [errors]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
 
        // validar todos los campos con reglas definidas
        const hasErrors = validateAll();
        if (hasErrors) return;
 
        post('/properties', {
            preserveScroll: true,
            onSuccess: () => {
                setData(initialValues);
                toast.success('Propiedad creada', {
                    description: 'Los datos de la propiedad han sido guardados exitosamente.',
                });
                // limpiar errores locales al guardar correctamente
                setClientErrors({});
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
        <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl p-4">
            
            <Card className="w-full border-slate-200 bg-slate-100 shadow-sm">
                <CardHeader className="relative space-y-1.5">
                    <CardTitle className="text-center text-2xl font-semibold text-primary">Property Registry</CardTitle>
                    {/* <CardDescription className="text-center text-slate-600">
                        Complete los campos para registrar una nueva propiedad
                    </CardDescription> */}
                </CardHeader>
                <CardContent className="space-y-">
                    <form onSubmit={submit} className="space-y-5">
                        <CustomAccordion
                            type="single"
                            defaultValue="item-1"
                            className="w-full mb-4"
                            collapsible
                        >
                            <AccordionItem value="item-1">
                                <AccordionTrigger>[Information Basic]</AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-cols-3">
                                        <div className="space-y-2.5">
                                            <Label className="text-sm font-medium text-slate-900">Property Number</Label>
                                            <Input
                                                value={data.id}
                                                onChange={(e) => handleChange('id', e.target.value)}
                                                onBlur={() => validateField('id')}
                                                placeholder="Property Number"
                                                className="w-full border-slate-200 bg-white"
                                                type="number"
                                                disabled
                                            />
                                            <InputError className="mt-1" message={clientErrors.id || errors.id} />
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-sm font-medium text-slate-900">Daily</Label>
                                            <Input
                                                value={data.daily}
                                                onChange={(e) => handleChange('daily', e.target.value)}
                                                onBlur={() => validateField('daily')}
                                                placeholder="Daily"
                                                className="w-full border-slate-200 bg-white"
                                                // type='number'
                                            />
                                            <InputError className="mt-1" message={clientErrors.daily || errors.daily} />
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-sm font-medium text-slate-900">Page Entry</Label>
                                            <Input
                                                value={data.page_entry}
                                                onChange={(e) => setData('page_entry', e.target.value)}
                                                placeholder="Page Entry"
                                                className="w-full border-slate-200 bg-white"
                                            />
                                            <InputError className="mt-1" message={errors.page_entry} />
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-sm font-medium text-slate-900">Track No.</Label>
                                            <Input
                                                value={data.track_no}
                                                onChange={(e) => setData('track_no', e.target.value)}
                                                placeholder="Track No."
                                                className="w-full border-slate-200 bg-white"
                                            />
                                            <InputError className="mt-1" message={errors.track_no} />
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-sm font-medium text-slate-900" 
                                                htmlFor="state">Municipality</Label>

                                            <SelectElement
                                                data={masterData.municipalities}
                                                valueSelected={data.municipality_id?.toString() ?? ''}
                                                onChangeEvent={useCallback(
                                                    (newValue: string) => {
                                                        setData('municipality_id', newValue);
                                                    },
                                                    [setData],
                                                )}
                                                className="w-full border-slate-200 bg-white"
                                            />
                                            <InputError className="mt-1" message={errors.municipality_id} />
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-sm font-medium text-slate-900" 
                                                htmlFor="state">Status</Label>

                                            <SelectElement
                                                data={masterData.property_statuses}
                                                valueSelected={data.property_status_id?.toString() ?? ''}
                                                onChangeEvent={useCallback(
                                                    (newValue: string) => {
                                                        setData('property_status_id', newValue);
                                                    },
                                                    [setData],
                                                )}
                                                className="w-full border-slate-200 bg-white"
                                            />
                                            <InputError className="mt-1" message={errors.property_status_id} />
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-sm font-medium text-slate-900">Registry</Label>
                                            <Input
                                                value={data.registry}
                                                onChange={(e) => handleChange('registry', e.target.value)}
                                                onBlur={() => validateField('registry')}
                                                placeholder="Registry"
                                                className="w-full border-slate-200 bg-white"
                                                // type='number'
                                            />
                                            <InputError className="mt-1" message={clientErrors.registry || errors.registry} />
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-sm font-medium text-slate-900">Deed No.</Label>
                                            <Input
                                                value={data.deed_no}
                                                onChange={(e) => handleChange('deed_no', e.target.value)}
                                                onBlur={() => validateField('deed_no')}
                                                placeholder="Deed No."
                                                className="w-full border-slate-200 bg-white"
                                                // type='number'
                                            />
                                            <InputError className="mt-1" message={clientErrors.deed_no || errors.deed_no} />
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label htmlFor="sale_date">Sale Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn('w-full justify-start text-left font-normal', !data.sale_date && 'text-muted-foreground')}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {data.sale_date instanceof Date ? (
                                                            format(data.sale_date, 'PPP', { locale: es })
                                                        ) : (
                                                            <span>Seleccionar fecha</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={data.sale_date instanceof Date ? data.sale_date : undefined}
                                                        onSelect={(date) => date && isStartDateValid(date) && setData('sale_date', date)}
                                                        disabled={(date) => !isStartDateValid(date)}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <InputError className="mt-1" message={errors.sale_date} />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>[Property Values]</AccordionTrigger>
                                <AccordionContent>
                                    Yes. It adheres to the WAI-ARIA design pattern.
                                </AccordionContent>
                            </AccordionItem>
                        </CustomAccordion>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 w-full cursor-pointer bg-primary font-medium text-white hover:bg-primary/90"
                        >
                            Guardar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

CreateProperty.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Crear propiedad" />
        {page}
    </AppLayout>
);

export default CreateProperty;
