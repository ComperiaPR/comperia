export interface Property {

    id: number | null;
    daily: number | null;
    page_entry: string | null;
    track_no: string | null;
    municipality_id: number | '';
    property_status_id: number | 1;
    registry: string | null;
    deed_no: string | null;
    sale_date: Date | string | null;
    transaction_type_id: number | null;
    notary: string | null;
    seller: string | null;
    resident_seller: string | null;
    buyer: string | null;
    resident_buyer: string | null;
    development: string | null;
    street: string | null;
    unit_number: string | null;
    ward: string | null;
    sector: string | null;
    road_kilometer: string | null;
    zip_code: string | null;
    cadastre: string | null;
    property_type_id: number | null;
    folio_page: string | null;
    volumen: string | null;
    inscription: string | null;
    source: string | null;
    remarks: string | null;
    mortgagee_id: number | null;
    mortgagee_amount: number | null;
    interest_rate: number | null;
    public_web: boolean;
    latitude: string | null;
    longitude: string | null;
    area_sqr_meter: number | null;
    area_sqr_feet: number | null;
    area_cuerdas: number | null;
    price: number | null;
    price_sqr_meter: number | null;
    price_sqr_feet: number | null;
    price_cuerdas: number | null;
    gla_sf: string | null;
    gba_sf: string | null;
    zoning: string | null;
    flood_zone: string | null;
    property_condition_id: number | null;
    past_current_use: string | null;
    municipality: defaultGeneric | null;
    property_type: defaultGeneric | null;
    property_status: defaultGeneric | null;
    transaction_type: defaultGeneric | null;
    mortgagee: defaultGeneric | null;
    lite: boolean;
}

export interface defaultGeneric {
    id: number | null;
    name: string | null;
}
