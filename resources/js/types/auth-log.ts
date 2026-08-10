export interface AuthLog {
    id: number;
    email: string;
    ip_address: string | null;
    user_agent: string | null;
    login_at: string;
    logout_at: string | null;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    } | null;
}
