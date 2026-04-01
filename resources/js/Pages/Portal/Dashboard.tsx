import { Head, Link } from "@inertiajs/react";
import PortalLayout from "@/Layouts/PortalLayout";
import {
    type Contract,
    type Invoice,
    CONTRACT_STATUS_COLORS,
    CONTRACT_STATUS_LABELS,
    INVOICE_STATUS_COLORS,
    INVOICE_STATUS_LABELS,
} from "@/types";

interface Stats {
    pending_contracts: number;
    unpaid_invoices: number;
    total_paid: number;
}

interface Props {
    contracts: Contract[];
    invoices: Invoice[];
    stats: Stats;
    client: { id: number; contact_name: string; company_name: string | null };
}

export default function PortalDashboard({
    contracts,
    invoices,
    stats,
    client,
}: Props) {
    return (
        <PortalLayout title={`Welcome, ${client.contact_name}`}>
            <Head title="Client Portal" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">
                        Pending Contracts
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                        {stats.pending_contracts}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">
                        Unpaid Invoices
                    </p>
                    <p className="text-2xl font-bold text-red-500">
                        {stats.unpaid_invoices}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">Total Paid</p>
                    <p className="text-2xl font-bold text-green-600">
                        €
                        {(stats.total_paid / 100).toLocaleString("de-DE", {
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
            </div>

            {/* Contracts */}
            <div className="mb-8">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Contracts
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {contracts.length === 0 && (
                        <p className="px-6 py-8 text-sm text-gray-400 text-center">
                            No contracts yet.
                        </p>
                    )}
                    {contracts.map((contract, i) => (
                        <div
                            key={contract.id}
                            className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
                                i < contracts.length - 1
                                    ? "border-b border-gray-100"
                                    : ""
                            }`}
                        >
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${CONTRACT_STATUS_COLORS[contract.status]}`}
                            >
                                {CONTRACT_STATUS_LABELS[contract.status]}
                            </span>
                            <p className="flex-1 text-sm font-medium text-gray-900">
                                {contract.title}
                            </p>
                            {contract.status === "sent" && (
                                <a
                                    href={`/contracts/${contract.token}/sign`}
                                    className="px-4 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:opacity-90 transition-all"
                                >
                                    Review & Sign →
                                </a>
                            )}
                            {contract.status === "signed" && (
                                <a
                                    href={`/contracts/${contract.token}/sign`}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                    View ↗
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Invoices */}
            <div>
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Invoices
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {invoices.length === 0 && (
                        <p className="px-6 py-8 text-sm text-gray-400 text-center">
                            No invoices yet.
                        </p>
                    )}
                    {invoices.map((invoice, i) => (
                        <div
                            key={invoice.id}
                            className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
                                i < invoices.length - 1
                                    ? "border-b border-gray-100"
                                    : ""
                            }`}
                        >
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${INVOICE_STATUS_COLORS[invoice.status]}`}
                            >
                                {INVOICE_STATUS_LABELS[invoice.status]}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                    {invoice.number}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Due{" "}
                                    {new Date(
                                        invoice.due_at,
                                    ).toLocaleDateString("de-DE")}
                                </p>
                            </div>
                            <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                                €
                                {(invoice.total_cents / 100).toLocaleString(
                                    "de-DE",
                                    { minimumFractionDigits: 2 },
                                )}
                            </span>
                            {["sent", "viewed", "overdue", "partial"].includes(
                                invoice.status,
                            ) && (
                                <Link
                                    href={`/portal/invoices/${invoice.id}/pay`}
                                    className="px-4 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Pay Now →
                                </Link>
                            )}
                            {invoice.status === "paid" && (
                                <span className="text-xs text-green-600 font-medium">
                                    ✓ Paid{" "}
                                    {invoice.paid_at
                                        ? new Date(
                                              invoice.paid_at,
                                          ).toLocaleDateString("de-DE")
                                        : ""}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </PortalLayout>
    );
}
