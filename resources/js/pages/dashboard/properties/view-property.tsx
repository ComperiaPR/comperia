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
import { Checkbox } from '@/components/ui/checkbox';
import { NumericFormat } from 'react-number-format';
import SelectElement from '@/components/ui/select-element';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InfoArea, InfoMunicipality, Mortgagee, Municipality, PropertyCondition, PropertyStatus, PropertyType, TransactionType } from '@/types/master-data';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Properties',
        href: '/properties',
    },
    {
        title: 'View property',
        href: '',
    },
];

interface MasterDataProps {
    municipalities: Municipality[];
    property_statuses: PropertyStatus[];
    transaction_types: TransactionType[];
    property_types: PropertyType[];
    mortgagees: Mortgagee[];
    property_conditions: PropertyCondition[];
    property: Property;
}

const InfoMunicipalitys = InfoMunicipality;

const ViewProperty = (masterData: MasterDataProps) => {
    const property : Property = masterData.property

    const { data, setData, put, errors, processing } = useForm(property);
    // errores de validación del lado del cliente
    const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({});
    
    // validators centralizados
    const validators = useMemo(
        () => ({
            // acepta solo dígitos (permite vacío). Si quieres hacerlo obligatorio, valida en otro lugar.
            daily: (v: unknown) => (/^\d*$/.test(String(v)) ? null : 'Daily debe contener solo dígitos.'),
            // zip_code: (v: unknown) => (/^\d*$/.test(String(v)) ? null : 'Zip Code debe contener solo dígitos.'),
            latitude: (v: unknown) => (/^[\d.-]*$/.test(String(v)) ? null : 'Latitude debe contener solo dígitos y puntos.'),
            longitude: (v: unknown) => (/^[\d.-]*$/.test(String(v)) ? null : 'Longitude debe contener solo dígitos y puntos.'),
            // añadir más reglas si es necesario:
            // page_entry: (v) => v ? null : 'Page entry requerido.',
        }),
        [],
    );
    // helper genérico para cambios: setData + limpiar error de campo
    const handleChange = useCallback(
        (name: string, value: any) => {
            setData(name as any, value);
            setClientErrors((prev) => ({ ...prev, [name]: undefined }));
        },
        [setData],
    );
    
    // valida un campo y actualiza clientErrors
    const validateField = useCallback(
        (name: string): string | null => {
            const rule = (validators as any)[name];
            if (!rule) {
                // no hay validación definida para este campo
                setClientErrors((prev) => ({ ...prev, [name]: undefined }));
                return null;
            }
            const err = rule((data as any)[name]);
            setClientErrors((prev) => ({ ...prev, [name]: err || undefined }));
            return err;
        },
        [data, validators],
    );
    
    const setLotAreas = useCallback(
        (field: string) => {
            if (field == 'area_sqr_meter' && data.area_sqr_meter) {
                let valTempCuerda = Number(data.area_sqr_meter) / InfoArea.defaultCuerdas;
                setData('area_cuerdas', Number(valTempCuerda.toFixed(4)));
                setData('area_sqr_feet', Number((valTempCuerda * InfoArea.defaultMeet).toFixed(2)));
            } else if (field == 'area_cuerdas' && data.area_cuerdas) {
                let valTempFeet = Number(data.area_cuerdas) * InfoArea.defaultMeet;
                setData('area_sqr_feet', Number(valTempFeet.toFixed(2)));
                setData('area_sqr_meter', Number((InfoArea.defaultCuerdas * Number(data.area_cuerdas)).toFixed(2)));
            } else if (field == 'area_sqr_feet' && data.area_sqr_feet) {
                let valTempMeter = Number(data.area_sqr_feet) / InfoArea.defaultFeet;
                setData('area_sqr_meter', Number(valTempMeter.toFixed(2)));
                setData('area_cuerdas', Number((valTempMeter / InfoArea.defaultCuerdas).toFixed(4)));
            } else {
                setData('area_cuerdas', 0);
                setData('area_sqr_meter', 0);
                setData('area_sqr_feet', 0);
            }
        },
        [data, setData],
    );

    const setPrimePer = useCallback(() => {
        if (data.price && data.area_sqr_meter) {
            const pricePerSquareMeter = Number(data.price) / Number(data.area_sqr_meter);
            setData('price_sqr_meter', Number(pricePerSquareMeter.toFixed(2)));
        } else {
            setData('price_sqr_meter', 0);
        }
        if (data.price && data.area_sqr_feet) {
            const pricePerSquareFeet = Number(data.price) / Number(data.area_sqr_feet);
            setData('price_sqr_feet', Number(pricePerSquareFeet.toFixed(2)));
        } else {
            setData('price_sqr_feet', 0);
        }
        if (data.price && data.area_cuerdas) {
            const pricePerCuerda = Number(data.price) / Number(data.area_cuerdas);
            setData('price_cuerdas', Number(pricePerCuerda.toFixed(2)));
        } else {
            setData('price_cuerdas', 0);
        }
    }, [data, setData]);

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

    // sincronizar errores de servidor con los errores cliente (para mostrarlos)
    useEffect(() => {
        if (errors && Object.keys(errors).length) {
            setClientErrors((prev) => ({ ...prev, ...(errors as Record<string, string>) }));
        }
    }, [errors]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put('/properties/'+property.id, {
            preserveScroll: true,
            onSuccess: () => {
                setData(property);
                toast.success('Propiedad actualizada', {
                    description: 'Los datos de la propiedad han sido actualizados exitosamente.',
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
            <Card className="w-full border-slate-200 shadow-sm">
                {/* <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gestión de Propiedades</CardTitle>
                    </div>
                </CardHeader> */}
                <CardContent className="space-y-">
                        <div className="mx-auto w-full overflow-hidden rounded-md border border-blue-500">
                            {/* [Information Basic] */}
                            <div className="w-full bg-blue-600 px-4 py-2 font-semibold text-white">[Property: {data.id}]</div>
                            <div className="mx-2.5 my-2.5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Property Number</Label>
                                    <Input
                                        value={data.id ?? ''}
                                        className="w-full border-slate-200 bg-white"
                                        type="text"
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Daily</Label>
                                    <Input
                                        value={data.daily ?? ''}
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
                                        value={data.page_entry ?? ''}
                                        onChange={(e) => setData('page_entry', e.target.value)}
                                        placeholder="Page Entry"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={errors.page_entry} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Track No.</Label>
                                    <Input
                                        value={data.track_no ?? ''}
                                        onChange={(e) => setData('track_no', e.target.value)}
                                        placeholder="Track No."
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={errors.track_no} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900" htmlFor="state">
                                        Municipality
                                    </Label>

                                    <SelectElement
                                        data={masterData.municipalities}
                                        valueSelected={data.municipality_id?.toString() ?? ''}
                                        onChangeEvent={useCallback(
                                            (newValue: number | string) => {
                                                setData('municipality_id', parseInt(newValue.toString()));
                                                const selectedMunicipality = InfoMunicipalitys.find((m) => m.id === Number(newValue));
                                                setData('zip_code', selectedMunicipality ? selectedMunicipality.zipcode : '');
                                                setData('cadastre', selectedMunicipality ? selectedMunicipality.catastro : '');
                                            },
                                            [setData],
                                        )}
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={errors.municipality_id} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900" htmlFor="state">
                                        Status
                                    </Label>

                                    <SelectElement
                                        data={masterData.property_statuses}
                                        valueSelected={data.property_status_id?.toString() ?? ''}
                                        onChangeEvent={useCallback(
                                            (newValue: number | string) => {
                                                setData('property_status_id', parseInt(newValue.toString()));
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
                                        value={data.registry ?? ''}
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
                                        value={data.deed_no ?? ''}
                                        onChange={(e) => handleChange('deed_no', e.target.value)}
                                        onBlur={() => validateField('deed_no')}
                                        placeholder="Deed No."
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.deed_no || errors.deed_no} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label htmlFor="sale_date">Sale Date</Label>
                                    <input
                                        type="date"
                                        max={new Date().toISOString().split('T')[0]}
                                        value={data.sale_date ? new Date(data.sale_date).toISOString().split('T')[0] : ''}
                                        onChange={(date) => handleChange('sale_date', date.target.value)}
                                        className="w-full rounded-md border-slate-200 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <InputError className="mt-1" message={errors.sale_date} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900" htmlFor="state">
                                        Type of Transaction
                                    </Label>

                                    <SelectElement
                                        data={masterData.transaction_types}
                                        valueSelected={data.transaction_type_id?.toString() ?? ''}
                                        onChangeEvent={useCallback(
                                            (newValue: number | string) => {
                                                setData('transaction_type_id', parseInt(newValue.toString()));
                                            },
                                            [setData],
                                        )}
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={errors.transaction_type_id} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Notary</Label>
                                    <Input
                                        value={data.notary ?? ''}
                                        onChange={(e) => handleChange('notary', e.target.value)}
                                        onBlur={() => validateField('notary')}
                                        placeholder="Notary"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.notary || errors.notary} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Seller</Label>
                                    <Input
                                        value={data.seller ?? ''}
                                        onChange={(e) => handleChange('seller', e.target.value)}
                                        onBlur={() => validateField('seller')}
                                        placeholder="Seller"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.seller || errors.seller} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Resident of Seller</Label>
                                    <Input
                                        value={data.resident_seller ?? ''}
                                        onChange={(e) => handleChange('resident_seller', e.target.value)}
                                        onBlur={() => validateField('resident_seller')}
                                        placeholder="Resident of Seller"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.resident_seller || errors.resident_seller} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Buyer</Label>
                                    <Input
                                        value={data.buyer ?? ''}
                                        onChange={(e) => handleChange('buyer', e.target.value)}
                                        onBlur={() => validateField('buyer')}
                                        placeholder="Buyer"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.buyer || errors.buyer} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Resident of Buyer</Label>
                                    <Input
                                        value={data.resident_buyer ?? ''}
                                        onChange={(e) => handleChange('resident_buyer', e.target.value)}
                                        onBlur={() => validateField('resident_buyer')}
                                        placeholder="Resident of Buyer"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.resident_buyer || errors.resident_buyer} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Development</Label>
                                    <Input
                                        value={data.development ?? ''}
                                        onChange={(e) => handleChange('development', e.target.value)}
                                        onBlur={() => validateField('development')}
                                        placeholder="Development"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.development || errors.development} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Street</Label>
                                    <Input
                                        value={data.street ?? ''}
                                        onChange={(e) => handleChange('street', e.target.value)}
                                        onBlur={() => validateField('street')}
                                        placeholder="Street"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.street || errors.street} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Unit Number</Label>
                                    <Input
                                        value={data.unit_number ?? ''}
                                        onChange={(e) => handleChange('unit_number', e.target.value)}
                                        onBlur={() => validateField('unit_number')}
                                        placeholder="Unit Number"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.unit_number || errors.unit_number} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Ward</Label>
                                    <Input
                                        value={data.ward ?? ''}
                                        onChange={(e) => handleChange('ward', e.target.value)}
                                        onBlur={() => validateField('ward')}
                                        placeholder="Ward"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.ward || errors.ward} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Sector</Label>
                                    <Input
                                        value={data.sector ?? ''}
                                        onChange={(e) => handleChange('sector', e.target.value)}
                                        onBlur={() => validateField('sector')}
                                        placeholder="Sector"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.sector || errors.sector} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Road / Kilometer</Label>
                                    <Input
                                        value={data.road_kilometer ?? ''}
                                        onChange={(e) => handleChange('road_kilometer', e.target.value)}
                                        onBlur={() => validateField('road_kilometer')}
                                        placeholder="Road / Kilometer"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.road_kilometer || errors.road_kilometer} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Zip Code</Label>
                                    <Input
                                        value={data.zip_code ?? ''}
                                        onChange={(e) => handleChange('zip_code', e.target.value)}
                                        // onBlur={() => validateField('zip_code')}
                                        placeholder="Zip Code"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.zip_code || errors.zip_code} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Catastro</Label>
                                    <Input
                                        value={data.cadastre ?? ''}
                                        onChange={(e) => handleChange('cadastre', e.target.value)}
                                        onBlur={() => validateField('cadastre')}
                                        placeholder="Catastro"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.cadastre || errors.cadastre} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900" htmlFor="state">
                                        Property type
                                    </Label>

                                    <SelectElement
                                        data={masterData.property_types}
                                        valueSelected={data.property_type_id?.toString() ?? ''}
                                        onChangeEvent={useCallback(
                                            (newValue: number | string) => {
                                                setData('property_type_id', Number(newValue));
                                            },
                                            [setData],
                                        )}
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={errors.property_type_id} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Page (Folio)</Label>
                                    <Input
                                        value={data.folio_page ?? ''}
                                        onChange={(e) => handleChange('folio_page', e.target.value)}
                                        onBlur={() => validateField('folio_page')}
                                        placeholder="Page (Folio)"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.folio_page || errors.folio_page} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Volumen</Label>
                                    <Input
                                        value={data.volumen ?? ''}
                                        onChange={(e) => handleChange('volumen', e.target.value)}
                                        onBlur={() => validateField('volumen')}
                                        placeholder="Volumen"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.volumen || errors.volumen} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Inscription</Label>
                                    <Input
                                        value={data.inscription ?? ''}
                                        onChange={(e) => handleChange('inscription', e.target.value)}
                                        onBlur={() => validateField('inscription')}
                                        placeholder="Inscription"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.inscription || errors.inscription} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Source</Label>
                                    <Textarea
                                        value={data.source ?? ''}
                                        onChange={(e) => handleChange('source', e.target.value)}
                                        onBlur={() => validateField('source')}
                                        placeholder="Source"
                                        className="min-h-[38px] w-full border-slate-200 bg-white"
                                        rows={1}
                                    />
                                    <InputError className="mt-1" message={clientErrors.source || errors.source} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Remarks</Label>
                                    <Textarea
                                        value={data.remarks ?? ''}
                                        onChange={(e) => handleChange('remarks', e.target.value)}
                                        onBlur={() => validateField('remarks')}
                                        placeholder="Remarks"
                                        className="min-h-[38px] w-full border-slate-200 bg-white"
                                        rows={1}
                                    />
                                    <InputError className="mt-1" message={clientErrors.remarks || errors.remarks} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900" htmlFor="state">
                                        Mortagagee
                                    </Label>

                                    <SelectElement
                                        data={masterData.mortgagees}
                                        valueSelected={data.mortgagee_id?.toString() ?? ''}
                                        onChangeEvent={useCallback(
                                            (newValue: number | string) => {
                                                setData('mortgagee_id', Number(newValue));
                                            },
                                            [setData],
                                        )}
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={errors.mortgagee_id} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Mortagagee Amount</Label>
                                    <NumericFormat
                                        value={data.mortgagee_amount ?? ''}
                                        thousandSeparator=","
                                        decimalSeparator="."
                                        prefix="$ "
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale
                                        onValueChange={(values) => {
                                            const { floatValue } = values;
                                            handleChange('mortgagee_amount', floatValue || 0);
                                        }}
                                        onBlur={() => validateField('mortgagee_amount')}
                                        className="w-full rounded-md border-slate-200 bg-white px-3 py-1.5"
                                    />
                                    <InputError className="mt-1" message={clientErrors.mortgagee_amount || errors.mortgagee_amount} />
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Interest Rate %</Label>
                                    <NumericFormat
                                        value={data.interest_rate ?? ''}
                                        thousandSeparator=","
                                        decimalSeparator="."
                                        prefix="% "
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale
                                        onValueChange={(values) => {
                                            const { floatValue } = values;
                                            handleChange('interest_rate', floatValue || 0);
                                        }}
                                        onBlur={() => validateField('interest_rate')}
                                        className="w-full rounded-md border-gray-300 bg-white px-3 py-1.5"
                                    />
                                    <InputError className="mt-1" message={clientErrors.interest_rate || errors.interest_rate} />
                                </div>

                                <div className="space-y-2.5">
                                    <Checkbox
                                        id="public_web"
                                        name="public_web"
                                        checked={data.public_web}
                                        onClick={() => setData('public_web', !data.public_web)}
                                        className="border border-gray-300 bg-white"
                                    />
                                    <Label htmlFor="public_web" className="text-sm font-medium text-slate-900">
                                        {' '}
                                        Page Web
                                    </Label>
                                </div>
                            </div>
                            {/* [Geolocalization] */}
                            <div className="mx-2.5 my-2.5 grid grid-cols-1 gap-4">
                                <div className="mx-auto w-full overflow-hidden rounded-md border border-blue-500">
                                    {/* Header */}
                                    <div className="w-full bg-blue-600 px-4 py-2 font-semibold text-white">[Geolocalization]</div>

                                    {/* Content */}
                                    <div className="bg-white p-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {/* Latitude */}
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900">Latitude</Label>
                                                <Input
                                                    value={data.latitude ?? ''}
                                                    onChange={(e) => handleChange('latitude', e.target.value)}
                                                    onBlur={() => validateField('latitude')}
                                                    placeholder="Latitude"
                                                    className="w-full border-slate-200 bg-white"
                                                />
                                                <InputError className="mt-1" message={clientErrors.latitude || errors.latitude} />
                                            </div>

                                            {/* Longitude */}
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900">Longitude</Label>
                                                <Input
                                                    value={data.longitude ?? ''}
                                                    onChange={(e) => handleChange('longitude', e.target.value)}
                                                    onBlur={() => validateField('longitude')}
                                                    placeholder="Longitude"
                                                    className="w-full border-slate-200 bg-white"
                                                />
                                                <InputError className="mt-1" message={clientErrors.longitude || errors.longitude} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mx-2.5 my-2.5 grid grid-cols-1 gap-4">
                                <div className="mx-auto w-full overflow-hidden rounded-md border border-blue-500">
                                    {/* [Lot Area] */}
                                    <div className="w-full bg-blue-600 px-4 py-2 font-semibold text-white">[Lot Area]</div>

                                    {/* Content */}
                                    <div className="bg-white p-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {/* Latitude */}
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900">Sqr. Meter</Label>
                                                <NumericFormat
                                                    value={data.area_sqr_meter ?? ''}
                                                    thousandSeparator=","
                                                    decimalSeparator="."
                                                    prefix=""
                                                    allowNegative={false}
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    onValueChange={(values) => {
                                                        const { floatValue } = values;
                                                        handleChange('area_sqr_meter', floatValue || 0);
                                                    }}
                                                    onBlur={() => {
                                                        validateField('area_sqr_meter');
                                                        setLotAreas('area_sqr_meter');
                                                    }}
                                                    onKeyUp={() => {
                                                        setLotAreas('area_sqr_meter');
                                                    }}
                                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5"
                                                />
                                                <InputError className="mt-1" message={clientErrors.area_sqr_meter || errors.area_sqr_meter} />
                                            </div>

                                            {/* Longitude */}
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900">Sqr. Feet</Label>
                                                <NumericFormat
                                                    value={data.area_sqr_feet ?? ''}
                                                    thousandSeparator=","
                                                    decimalSeparator="."
                                                    prefix=""
                                                    allowNegative={false}
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    onValueChange={(values) => {
                                                        const { floatValue } = values;
                                                        handleChange('area_sqr_feet', floatValue || 0);
                                                    }}
                                                    onBlur={() => {
                                                        validateField('area_sqr_feet');
                                                        setLotAreas('area_sqr_feet');
                                                    }}
                                                    onKeyUp={() => {
                                                        setLotAreas('area_sqr_feet');
                                                    }}
                                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5"
                                                />
                                                <InputError className="mt-1" message={clientErrors.area_sqr_feet || errors.area_sqr_feet} />
                                            </div>

                                            {/* Longitude */}
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900">Cuerdas</Label>
                                                <NumericFormat
                                                    value={data.area_cuerdas ?? ''}
                                                    thousandSeparator=","
                                                    decimalSeparator="."
                                                    prefix=""
                                                    allowNegative={false}
                                                    decimalScale={4}
                                                    fixedDecimalScale
                                                    onValueChange={(values) => {
                                                        const { floatValue } = values;
                                                        handleChange('area_cuerdas', floatValue || 0);
                                                    }}
                                                    onBlur={() => {
                                                        validateField('area_cuerdas');
                                                        setLotAreas('area_cuerdas');
                                                    }}
                                                    onKeyUp={() => {
                                                        setLotAreas('area_cuerdas');
                                                    }}
                                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5"
                                                />
                                                <InputError className="mt-1" message={clientErrors.area_cuerdas || errors.area_cuerdas} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Sales Price */}
                            <div className="mx-2.5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Sales Price</Label>
                                    <NumericFormat
                                        value={data.price ?? ''}
                                        thousandSeparator=","
                                        decimalSeparator="."
                                        prefix="$ "
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale
                                        onValueChange={(values) => {
                                            const { floatValue } = values;
                                            handleChange('price', floatValue || 0);
                                        }}
                                        onBlur={() => {
                                            validateField('price');
                                            setPrimePer();
                                        }}
                                        onKeyUp={() => {
                                            setPrimePer();
                                        }}
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5"
                                    />
                                    <InputError className="mt-1" message={clientErrors.price || errors.price} />
                                </div>
                            </div>

                            <div className="mx-2.5 my-2.5 grid grid-cols-1 gap-4">
                                <div className="mx-auto w-full overflow-hidden rounded-md border border-blue-500">
                                    {/* [Price Per] */}
                                    <div className="w-full bg-blue-600 px-4 py-2 font-semibold text-white">[Price Per]</div>

                                    {/* Content */}
                                    <div className="bg-white p-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {/* Sqr. Meter */}
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900">Sqr. Meter</Label>
                                                <NumericFormat
                                                    value={data.price_sqr_meter ?? ''}
                                                    thousandSeparator=","
                                                    decimalSeparator="."
                                                    prefix=""
                                                    disabled
                                                    allowNegative={false}
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-1.5"
                                                />
                                                <InputError className="mt-1" message={clientErrors.price_sqr_meter || errors.price_sqr_meter} />
                                            </div>

                                            {/* Sqr. Feet */}
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900">Sqr. Feet</Label>
                                                <NumericFormat
                                                    value={data.price_sqr_feet ?? ''}
                                                    thousandSeparator=","
                                                    decimalSeparator="."
                                                    prefix=""
                                                    disabled
                                                    allowNegative={false}
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-1.5"
                                                />
                                                <InputError className="mt-1" message={clientErrors.price_sqr_feet || errors.price_sqr_feet} />
                                            </div>

                                            {/* Cuerdas */}
                                            <div className="space-y-2.5">
                                                <Label className="text-sm font-medium text-slate-900">Cuerdas</Label>
                                                <NumericFormat
                                                    value={data.price_cuerdas ?? ''}
                                                    thousandSeparator=","
                                                    decimalSeparator="."
                                                    prefix=""
                                                    disabled
                                                    allowNegative={false}
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-1.5"
                                                />
                                                <InputError className="mt-1" message={clientErrors.price_cuerdas || errors.price_cuerdas} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Grupo GLA - GBA - Zooning - Flood Zone - Property Condition */}
                            <div className="mx-2.5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">GLA +/- SF</Label>
                                    <Input
                                        value={data.gla_sf ?? ''}
                                        onChange={(e) => handleChange('gla_sf', e.target.value)}
                                        onBlur={() => validateField('gla_sf')}
                                        placeholder="GLA +/- SF"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.gla_sf || errors.gla_sf} />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">GBA +/- SF</Label>
                                    <Input
                                        value={data.gba_sf ?? ''}
                                        onChange={(e) => handleChange('gba_sf', e.target.value)}
                                        onBlur={() => validateField('gba_sf')}
                                        placeholder="GBA +/- SF"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.gba_sf || errors.gba_sf} />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Zoning</Label>
                                    <Input
                                        value={data.zoning ?? ''}
                                        onChange={(e) => handleChange('zoning', e.target.value)}
                                        onBlur={() => validateField('zoning')}
                                        placeholder="Zoning"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.zoning || errors.zoning} />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Flood Zone</Label>
                                    <Input
                                        value={data.flood_zone ?? ''}
                                        onChange={(e) => handleChange('flood_zone', e.target.value)}
                                        onBlur={() => validateField('flood_zone')}
                                        placeholder="Flood Zone"
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={clientErrors.flood_zone || errors.flood_zone} />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900" htmlFor="state">
                                        Property Condition
                                    </Label>
                                    <SelectElement
                                        data={masterData.property_conditions}
                                        valueSelected={data.property_condition_id?.toString() ?? ''}
                                        onChangeEvent={useCallback(
                                            (newValue: number | string) => {
                                                setData('property_condition_id', Number(newValue));
                                            },
                                            [setData],
                                        )}
                                        className="w-full border-slate-200 bg-white"
                                    />
                                    <InputError className="mt-1" message={errors.property_condition_id} />
                                </div>
                            </div>
                            {/* Property Past Current Use */}
                            <div className="mx-2.5 mb-4 grid grid-cols-1 gap-4 md:grid-cols-1">
                                <div className="space-y-2.5">
                                    <Label className="text-sm font-medium text-slate-900">Property Past Current Use</Label>
                                    <Textarea
                                        value={data.past_current_use ?? ''}
                                        onChange={(e) => handleChange('past_current_use', e.target.value)}
                                        onBlur={() => validateField('past_current_use')}
                                        placeholder="Past Current Use"
                                        className="min-h-[38px] w-full border-slate-200 bg-white"
                                        rows={1}
                                    />
                                    <InputError className="mt-1" message={clientErrors.past_current_use || errors.past_current_use} />
                                </div>
                            </div>
                        </div>
                </CardContent>
            </Card>
        </div>
    );
}

ViewProperty.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Ver propiedad" />
        {page}
    </AppLayout>
);

export default ViewProperty;
