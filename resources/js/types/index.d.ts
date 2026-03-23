export interface User {
    id: number;
    name: string;
    email: string;
    timezone: string;
    currency: string;
    brand_color: string;
    logo_path: string | null;
    company_name: string | null;
    steuernummer: string | null;
    ust_idnr: string | null;
}

export interface Client {
    id: number;
    user_id: number;
    company_name: string | null;
    contact_name: string;
    email: string;
    phone: string | null;
    country: string;
    display_name: string;
}

export interface PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> {
    auth: {
        user: User | null;
        client: Client | null;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
}

export type LeadStatus =
    | "new"
    | "contacted"
    | "proposal_sent"
    | "negotiation"
    | "won"
    | "lost";

export interface Lead {
    id: number;
    user_id: number;
    client_id: number | null;
    title: string;
    status: LeadStatus;
    source: string | null;
    value_estimate: number; // cents
    position: number;
    notes: string | null;
    won_at: string | null;
    lost_at: string | null;
    created_at: string;
    client?: {
        id: number;
        contact_name: string;
        company_name: string | null;
    };
}
