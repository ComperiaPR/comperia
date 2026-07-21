export interface ContactMessage {
    id: number;
    type: 'contact' | 'improvement';
    name: string;
    email: string;
    subject: string | null;
    message: string;
    property_id: number | null;
    improvement_type: string | null;
    improvement_type_label: string | null;
    property: {
        id: number;
        street: string | null;
        unit_number: string | null;
    } | null;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    } | null;
    created_at: string;
}
