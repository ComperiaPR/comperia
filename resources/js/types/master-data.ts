import { Property } from "./property"

export interface Municipality {
    id: number
    name: string
}
export interface PropertyStatus {
    id: number
    name: string
}
export interface PropertyType {
    id: number
    name: string
}
export interface TransactionType {
    id: number
    name: string
}
export interface Mortgagee {
    id: number
    name: string
}
export interface PropertyCondition {
    id: number
    name: string
}


export interface MasterData {
    municipalities: Municipality[]
    property_statuses: PropertyStatus[]
    property_types: PropertyType[]
    mortgagees: Mortgagee[]
    property_conditions: PropertyCondition[]
}

export const DefaultProperty: Property = {
        id: null,
        daily: null,
        page_entry: null,
        track_no: null,
        municipality_id: '',
        property_status_id: 1,
        registry: null,
        deed_no: null,
        sale_date: null,
        transaction_type_id: null,
        notary: null,
        seller: null,
        resident_seller: null,
        buyer: null,
        resident_buyer: null,
        development: null,
        street: null,
        unit_number: null,
        ward: null,
        sector: null,
        road_kilometer: null,
        zip_code: null,
        cadastre: null,
        property_type_id: null,
        folio_page: null,
        volumen: null,
        inscription: null,
        source: null,
        remarks: null,
        mortgagee_id: null,
        mortgagee_amount: null,
        interest_rate: null,
        public_web: false,
        latitude: '0',
        longitude: '0',
        area_sqr_meter: null,
        area_sqr_feet: null,
        area_cuerdas: null,
        price: null,
        price_sqr_meter: null,
        price_sqr_feet: null,
        price_cuerdas: null,
        gla_sf: null,
        gba_sf: null,
        zoning: null,
        flood_zone: null,
        property_condition_id: null,
        past_current_use: null,
        municipality: null,
        property_type: null,
        property_status: null,
        transaction_type: null,
        lite: false,
    };

export const InfoArea = {
    defaultCuerdas: 3930.39562,
    defaultMeet: 42306.426,
    defaultFeet: 10.7639103,
};

export const InfoMunicipality = [
    { id: 26, zipcode: '00602', catastro: '26-' },
    { id: 2, zipcode: '00662', catastro: '02-' },
    { id: 25, zipcode: '00677', catastro: '25-' },
    { id: 6, zipcode: '00612', catastro: '06-' },
    { id: 4, zipcode: '00627', catastro: '04-' },
    { id: 5, zipcode: '00659', catastro: '05-' },
    { id: 3, zipcode: '00678', catastro: '03-' },
    { id: 41, zipcode: '00794', catastro: '41-' },
    { id: 68, zipcode: '00705', catastro: '68-' },
    { id: 66, zipcode: '00769', catastro: '66-' },
    { id: 43, zipcode: '00782', catastro: '43-' },
    { id: 40, zipcode: '00783', catastro: '40-' },
    { id: 42, zipcode: '00719', catastro: '42-' },
    { id: 39, zipcode: '00720', catastro: '39-' },
    { id: 15, zipcode: '00961', catastro: '15-' },
    { id: 13, zipcode: '00949', catastro: '13-' },
    { id: 12, zipcode: '00953', catastro: '12-' },
    { id: 10, zipcode: '00692', catastro: '10-' },
    { id: 14, zipcode: '00962', catastro: '14-' },
    { id: 11, zipcode: '00646', catastro: '11-' },
    { id: 9, zipcode: '00693', catastro: '09-' },
    { id: 46, zipcode: '00725', catastro: '46-' },
    { id: 70, zipcode: '00736', catastro: '70-' },
    { id: 45, zipcode: '00703', catastro: '45-' },
    { id: 44, zipcode: '00739', catastro: '44-' },
    { id: 47, zipcode: '00778', catastro: '47-' },
    { id: 49, zipcode: '00777', catastro: '49-' },
    { id: 48, zipcode: '00754', catastro: '48-' },
    { id: 20, zipcode: '00985', catastro: '20-' },
    { id: 80, zipcode: '00729', catastro: '80-' },
    { id: 21, zipcode: '00772', catastro: '21-' },
    { id: 22, zipcode: '00745', catastro: '22-' },
    { id: 24, zipcode: '00738', catastro: '24-' },
    { id: 53, zipcode: '00735', catastro: '53-' },
    { id: 77, zipcode: '00775', catastro: '77-' },
    { id: 23, zipcode: '00773', catastro: '23-' },
    { id: 76, zipcode: '00765', catastro: '76-' },
    { id: 71, zipcode: '00784', catastro: '71-' },
    { id: 72, zipcode: '00714', catastro: '72-' },
    { id: 74, zipcode: '00707', catastro: '74-' },
    { id: 73, zipcode: '00723', catastro: '73-' },
    { id: 69, zipcode: '00751', catastro: '69-' },
    { id: 67, zipcode: '00757', catastro: '67-' },
    { id: 16, zipcode: '00969', catastro: '16-' },
    { id: 51, zipcode: '00791', catastro: '51-' },
    { id: 50, zipcode: '00771', catastro: '50-' },
    { id: 52, zipcode: '00718', catastro: '52-' },
    { id: 75, zipcode: '00767', catastro: '75-' },
    { id: 8, zipcode: '00674', catastro: '08-' },
    { id: 7, zipcode: '00617', catastro: '07-' },
    { id: 37, zipcode: '00638', catastro: '37-' },
    { id: 81, zipcode: '00650', catastro: '81-' },
    { id: 38, zipcode: '00687', catastro: '38-' },
    { id: 29, zipcode: '00680', catastro: '29-' },
    { id: 28, zipcode: '00610', catastro: '28-' },
    { id: 54, zipcode: '00660', catastro: '54-' },
    { id: 63, zipcode: '00731', catastro: '63-' },
    { id: 64, zipcode: '00795', catastro: '64-' },
    { id: 65, zipcode: '00766', catastro: '65-' },
    { id: 61, zipcode: '00656', catastro: '61-' },
    { id: 62, zipcode: '00624', catastro: '62-' },
    { id: 60, zipcode: '00698', catastro: '60-' },
    { id: 56, zipcode: '00683', catastro: '56-' },
    { id: 55, zipcode: '00622', catastro: '55-' },
    { id: 59, zipcode: '00653', catastro: '59-' },
    { id: 57, zipcode: '00667', catastro: '57-' },
    { id: 32, zipcode: '00606', catastro: '32-' },
    { id: 58, zipcode: '00637', catastro: '58-' },
    { id: 79, zipcode: '00901', catastro: '79-' },
    { id: 19, zipcode: '00976', catastro: '19-' },
    { id: 30, zipcode: '00685', catastro: '30-' },
    { id: 31, zipcode: '00670', catastro: '31-' },
    { id: 27, zipcode: '00676', catastro: '27-' },
    { id: 35, zipcode: '00641', catastro: '35-' },
    { id: 34, zipcode: '00601', catastro: '34-' },
    { id: 36, zipcode: '00664', catastro: '36-' },
    { id: 33, zipcode: '00669', catastro: '33-' },
];
