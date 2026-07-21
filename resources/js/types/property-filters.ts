export interface PropertyFilterValues {
    q: string;
    municipality_id: (string | number)[];
    property_type_id: (string | number)[];
    transaction_type_id: (string | number)[];
    price_min: string;
    price_max: string;
    area_min: string;
    area_max: string;
    date_from: string;
    date_to: string;
}

export const EMPTY_PROPERTY_FILTERS: PropertyFilterValues = {
    q: '',
    municipality_id: [],
    property_type_id: [],
    transaction_type_id: [],
    price_min: '',
    price_max: '',
    area_min: '',
    area_max: '',
    date_from: '',
    date_to: '',
};
