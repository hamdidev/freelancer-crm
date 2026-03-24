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
export type ProposalStatus =
    | "draft"
    | "sent"
    | "viewed"
    | "accepted"
    | "declined"
    | "expired";

export interface PricingItem {
    type: "pricing_item";
    attrs: {
        description: string;
        quantity: number;
        unit_price_cents: number;
    };
}

export type ContentBlock =
    | { type: "paragraph"; content: { type: "text"; text: string }[] }
    | {
          type: "heading";
          attrs: { level: number };
          content: { type: "text"; text: string }[];
      }
    | PricingItem;

export interface Proposal {
    id: number;
    user_id: number;
    client_id: number;
    lead_id: number | null;
    title: string;
    content: ContentBlock[];
    status: ProposalStatus;
    total_cents: number;
    currency: string;
    valid_until: string | null;
    token: string;
    viewed_at: string | null;
    accepted_at: string | null;
    declined_at: string | null;
    client_note: string | null;
    pdf_path: string | null;
    created_at: string;
    client?: {
        id: number;
        contact_name: string;
        company_name: string | null;
    };
    user?: {
        id: number;
        name: string;
        company_name: string | null;
        brand_color: string;
    };
}

