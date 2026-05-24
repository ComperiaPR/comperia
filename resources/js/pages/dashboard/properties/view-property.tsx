import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Property } from '@/types/property';
import React from 'react';
import { InfoMunicipality, Mortgagee, Municipality, PropertyCondition, PropertyStatus, PropertyType, TransactionType } from '@/types/master-data';

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
    const property: Property = masterData.property;

    // Helper para mostrar valores relacionados
    const getNameById = (arr: any[], id: number | string | undefined, field = 'id', label = 'name') =>
        arr.find((item) => String(item[field]) === String(id))?.[label] ?? '';

    return (
        <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl p-4">
            <Card className="w-full border-slate-200 shadow-sm">
                <CardContent className="space-y-">
                    <div className="mx-auto w-full overflow-hidden rounded-md border border-blue-500">
                        <div className="w-full bg-blue-600 px-4 py-2 font-semibold text-white">
                            [Property Number: { property.id}]
                        </div>
                        <div className="mx-2.5 my-2.5 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <span className="text-sm font-bold text-slate-900">Property Type:</span>
                                <div>{getNameById(masterData.property_types, property.property_type_id ?? '')}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Type of Transaction:</span>
                                <div>{getNameById(masterData.transaction_types, property.transaction_type_id ?? '')}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Sale Date:</span>
                                <div>{property.sale_date ? new Date(property.sale_date).toISOString().split('T')[0] : ''}</div>
                            </div>
                            <div className="w-full col-span-full mb-0">
                                <span className="text-md font-bold text-slate-900 mb-0">Address:</span>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Municipality:</span>
                                <div>{getNameById(masterData.municipalities, property.municipality_id)}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Development:</span>
                                <div>{property.development}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Street:</span>
                                <div>{property.street}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Unit No:</span>
                                <div>{property.unit_number}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Ward:</span>
                                <div>{property.ward}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Sector:</span>
                                <div>{property.sector}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Road/Km.:</span>
                                <div>{property.road_kilometer}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Zip Code:</span>
                                <div>{property.zip_code}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Tax ID:</span>
                                <div>{property.cadastre}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Latitude:</span>
                                <div>{property.latitude}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Longitude:</span>
                                <div>{property.longitude}</div>
                            </div>
                            <div className='mb-3'>
                                <span className="text-sm font-bold text-slate-900">Google Maps:</span>
                                <div>
                                    <a 
                                        href={`https://maps.google.com/?q=${property.latitude},${property.longitude}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className='text-blue'
                                    >
                                        https://maps.google.com/?q={property.latitude},{property.longitude}
                                    </a>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Seller:</span>
                                <div>{property.seller}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Resident of Seller:</span>
                                <div>{property.resident_seller}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Buyer:</span>
                                <div>{property.buyer}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Resident of Buyer:</span>
                                <div>{property.resident_buyer}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Notary:</span>
                                <div>{property.notary}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Deed No.:</span>
                                <div>{property.deed_no}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Registry:</span>
                                <div>{property.registry}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Track No.:</span>
                                <div>{property.track_no}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Daily:</span>
                                <div>{property.daily}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Page Entry:</span>
                                <div>{property.page_entry}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Inscription:</span>
                                <div>{property.inscription}</div>
                            </div>

                            {/* [Sale Price] */}
                            <div className="mx-0 my-0 grid grid-cols-1 gap-4 w-full col-span-full">
                                <div className="mx-auto w-full overflow-hidden rounded-md border border-blue-500">
                                    {/* Header */}
                                    <div className="w-full bg-blue-400 px-4 py-2 font-semibold text-white">
                                        {' Sale Price:  '} {property.price !== undefined && property.price !== null
                                            ? property.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                            : ''}
                                    </div>
                                    {/* Content */}
                                    <div className="bg-white p-2">
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <span className="text-sm font-bold text-slate-900">Price / Sq. Meter:</span>
                                                <div>
                                                    {property.price_sqr_meter !== undefined && property.price_sqr_meter !== null
                                                    ? property.price_sqr_meter.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                                    : ''}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-900">Price / Sq. Feet:</span>
                                                <div>
                                                    {property.price_sqr_feet !== undefined && property.price_sqr_feet !== null
                                                    ? property.price_sqr_feet.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                                    : ''}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-900">Price / Cuerda:</span>
                                                <div>
                                                    {property.price_cuerdas !== undefined && property.price_cuerdas !== null
                                                    ? property.price_cuerdas.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                                    : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* [Lot Area] */}
                            <div className="mx-0 my-0 grid grid-cols-1 gap-4 w-full col-span-full">
                                <div className="mx-auto w-full overflow-hidden rounded-md border border-blue-500">
                                    {/* Header */}
                                    <div className="w-full bg-blue-400 px-4 py-2 font-semibold text-white">
                                        {' Lot Area: '}
                                    </div>
                                    {/* Content */}
                                    <div className="bg-white p-2">
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <span className="text-sm font-bold text-slate-900">Sq. Meter:</span>
                                                <div>
                                                    {property.area_sqr_meter !== undefined && property.area_sqr_meter !== null
                                                    ? property.area_sqr_meter.toLocaleString('en-US')
                                                    : ''}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-900">Sq. Feet:</span>
                                                <div>
                                                    {property.area_sqr_feet !== undefined && property.area_sqr_feet !== null
                                                    ? property.area_sqr_feet.toLocaleString('en-US')
                                                    : ''}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-900">Cuerdas:</span>
                                                <div>
                                                    {property.area_cuerdas !== undefined && property.area_cuerdas !== null
                                                    ? property.area_cuerdas.toLocaleString('en-US')
                                                    : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mx-0 my-0 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 w-full col-span-full'>
                                <div>
                                    <span className="text-sm font-bold text-slate-900">GLA +/- SF:</span>
                                    <div>{property.gla_sf}</div>
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-slate-900">GBA +/- SF:</span>
                                    <div>{property.gba_sf}</div>
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-slate-900">Zoning:</span>
                                    <div>{property.zoning}</div>
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-slate-900">Flood Zone:</span>
                                    <div>{property.flood_zone}</div>
                                </div>
                            </div>
                            <div className='mx-0 my-0 grid grid-cols-1 gap1 w-full col-span-full'>
                                <span className="text-sm font-bold text-slate-900">Property Condition:</span>
                                <div>{getNameById(masterData.property_conditions, property.property_condition_id ?? '')}</div>
                            </div>
                            <div className='mx-0 my-0 grid grid-cols-1 gap1 w-full col-span-full'>
                                <span className="text-sm font-bold text-slate-900">Property Past / Current Use:</span>
                                <div>{property.past_current_use}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Mortagagee:</span>
                                <div>{getNameById(masterData.mortgagees, property.mortgagee_id ?? '')}</div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900">Mortagagee Amount:</span>
                                <div>
                                    {property.mortgagee_amount !== undefined && property.mortgagee_amount !== null
                                    ? property.mortgagee_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                    : ''}
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-bold text-slate-900">Interest Rate %:</Label>
                                <div>
                                    {property.interest_rate !== undefined && property.interest_rate !== null
                                    ? property.interest_rate.toLocaleString('en-US')
                                    : ''}
                                </div>
                            </div>
                            <div className='w-full col-span-full'>
                                <span className="text-sm font-bold text-slate-900">Remarks:</span>
                                <div>{property.remarks}</div>
                            </div>
                            <div className="w-full col-span-full mb-0">
                                <span className="text-md font-bold text-slate-900 mb-0">Property History:</span>
                            </div>
                            <div className="w-full col-span-full mb-0">
                                <span className="text-md font-bold text-slate-900 mb-0">Property Detail:</span>
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
