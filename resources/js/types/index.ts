import type { LeadStatus } from "./index.d.ts";

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
