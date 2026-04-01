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
        user: User | null; // freelancer (web guard)
        client: Client | null; // portal (client guard)
    };
    flash: {
        success?: string;
        error?: string;
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
    value_estimate: number;
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

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
    new: "New",
    contacted: "Contacted",
    proposal_sent: "Proposal Sent",
    negotiation: "Negotiation",
    won: "Won",
    lost: "Lost",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-violet-100 text-violet-700",
    proposal_sent: "bg-amber-100 text-amber-700",
    negotiation: "bg-orange-100 text-orange-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
};

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
    draft: "Draft",
    sent: "Sent",
    viewed: "Viewed",
    accepted: "Accepted",
    declined: "Declined",
    expired: "Expired",
};

export const PROPOSAL_STATUS_COLORS: Record<ProposalStatus, string> = {
    draft: "bg-gray-100 text-gray-700",
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-violet-100 text-violet-700",
    accepted: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
    expired: "bg-amber-100 text-amber-700",
};
export type InvoiceStatus =
    | "draft"
    | "sent"
    | "viewed"
    | "partial"
    | "paid"
    | "overdue"
    | "void";

export interface InvoiceItem {
    id?: number;
    description: string;
    quantity: number;
    unit_price_cents: number;
    total_cents: number;
    position: number;
    time_entry_ids?: number[] | null;
}

export interface Invoice {
    id: number;
    user_id: number;
    client_id: number;
    project_id: number | null;
    number: string;
    status: InvoiceStatus;
    currency: string;
    subtotal_cents: number;
    tax_rate: number;
    tax_cents: number;
    total_cents: number;
    issue_date: string;
    due_at: string;
    service_date: string | null;
    paid_at: string | null;
    viewed_at: string | null;
    stripe_payment_intent_id: string | null;
    notes: string | null;
    recurring: boolean;
    recurring_interval: "weekly" | "monthly" | null;
    created_at: string;
    client?: {
        id: number;
        contact_name: string;
        company_name: string | null;
    };
    items?: InvoiceItem[];
}

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-violet-100 text-violet-700",
    partial: "bg-amber-100 text-amber-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    void: "bg-slate-100 text-slate-600",
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
    draft: "Draft",
    sent: "Sent",
    viewed: "Viewed",
    partial: "Partial",
    paid: "Paid",
    overdue: "Overdue",
    void: "Void",
};

export type ContractStatus = "draft" | "sent" | "signed" | "rejected";

export interface Contract {
    id: number;
    user_id: number;
    client_id: number;
    proposal_id: number | null;
    title: string;
    body: string;
    status: ContractStatus;
    token: string;
    sent_at: string | null;
    signed_at: string | null;
    rejected_at: string | null;
    signature_path: string | null;
    signer_ip: string | null;
    document_hash: string | null;
    rejection_reason: string | null;
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
        email: string;
        steuernummer: string | null;
    };
}

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-blue-100 text-blue-700",
    signed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
};

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
    draft: "Draft",
    sent: "Sent",
    signed: "Signed",
    rejected: "Rejected",
};
export interface TimeEntry {
    id: number;
    user_id: number;
    project_id: number | null;
    description: string | null;
    started_at: string;
    ended_at: string | null;
    duration_seconds: number;
    billable: boolean;
    invoiced_at: string | null;
    created_at: string;
    project?: {
        id: number;
        name: string;
    };
}

export interface TimeStats {
    today_seconds: number;
    week_seconds: number;
    billable_uninvoiced: number;
}

export interface ClientPortalData {
    id: number;
    contact_name: string;
    company_name: string | null;
    email: string;
}
