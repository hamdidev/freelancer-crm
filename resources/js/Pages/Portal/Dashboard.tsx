// resources/js/Pages/Portal/Dashboard.tsx

import ClientPortalLayout from "@/Layouts/ClientPortalLayout";
import { Invoice, Proposal } from "@/types";
import { Receipt, FileText, PenLine } from "lucide-react";
import StatusBadge from "@/Components/StatusBadge";

interface Props {
    client: { name: string; email: string };
    stats: {
        open_invoices: number;
        pending_proposals: number;
        active_contracts: number;
    };
    recent_invoices: Invoice[];
    pending_proposals: Proposal[];
}

export default function PortalDashboard({
    stats,
    recent_invoices,
    pending_proposals,
}: Props) {
    return (
        <ClientPortalLayout title="Overview">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <StatCard
                    icon={Receipt}
                    label="Open Invoices"
                    value={stats.open_invoices}
                />
                <StatCard
                    icon={FileText}
                    label="Pending Proposals"
                    value={stats.pending_proposals}
                />
                <StatCard
                    icon={PenLine}
                    label="Active Contracts"
                    value={stats.active_contracts}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Recent invoices */}
                <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                    <h2 className="text-title-medium text-on-surface mb-4">
                        Recent Invoices
                    </h2>
                    {recent_invoices.length === 0 ? (
                        <p className="text-body-medium text-on-surface-variant">
                            No invoices yet.
                        </p>
                    ) : (
                        recent_invoices.map((inv) => (
                            <div
                                key={inv.id}
                                className="flex justify-between py-2 border-b
                                             border-outline-variant last:border-0"
                            >
                                <span className="text-body-medium text-on-surface">
                                    {inv.invoice_number}
                                </span>
                                <StatusBadge status={inv.status} />
                            </div>
                        ))
                    )}
                </section>

                {/* Pending proposals */}
                <section className="rounded-xl border border-outline-variant bg-surface-container p-6">
                    <h2 className="text-title-medium text-on-surface mb-4">
                        Awaiting Your Review
                    </h2>
                    {pending_proposals.length === 0 ? (
                        <p className="text-body-medium text-on-surface-variant">
                            No pending proposals.
                        </p>
                    ) : (
                        pending_proposals.map((p) => (
                            <div
                                key={p.id}
                                className="py-2 border-b border-outline-variant last:border-0"
                            >
                                <p className="text-body-medium text-on-surface">
                                    {p.title}
                                </p>
                            </div>
                        ))
                    )}
                </section>
            </div>
        </ClientPortalLayout>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
            <Icon size={20} className="text-primary mb-3" />
            <p className="text-display-small text-on-surface">{value}</p>
            <p className="text-body-small text-on-surface-variant">{label}</p>
        </div>
    );
}
