import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    type Invoice,
    INVOICE_STATUS_COLORS,
    INVOICE_STATUS_LABELS,
} from "@/types";

interface Stats {
    total_unpaid: number;
    total_paid_ytd: number;
    overdue_count: number;
}

interface Props {
    invoices: Invoice[];
    stats: Stats;
}

export default function InvoicesIndex({ invoices, stats }: Props) {
    return (
        <AppLayout title="Invoices">
            <Head title="Invoices" />

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">Outstanding</p>
                    <p className="text-2xl font-bold text-amber-600">
                        €
                        {(stats.total_unpaid / 100).toLocaleString("de-DE", {
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">Paid This Year</p>
                    <p className="text-2xl font-bold text-green-600">
                        €
                        {(stats.total_paid_ytd / 100).toLocaleString("de-DE", {
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">Overdue</p>
                    <p
                        className={`text-2xl font-bold ${stats.overdue_count > 0 ? "text-red-600" : "text-gray-400"}`}
                    >
                        {stats.overdue_count}
                    </p>
                </div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">
                    {invoices.length} invoices
                </p>
                <Link
                    href="/invoices/create"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + New Invoice
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {invoices.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <p className="text-gray-400 text-sm">
                            No invoices yet.
                        </p>
                        <Link
                            href="/invoices/create"
                            className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
                        >
                            Create your first invoice →
                        </Link>
                    </div>
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
                                {invoice.client?.company_name ??
                                    invoice.client?.contact_name}
                            </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-gray-900">
                                €
                                {(invoice.total_cents / 100).toLocaleString(
                                    "de-DE",
                                    { minimumFractionDigits: 2 },
                                )}
                            </p>
                            <p className="text-xs text-gray-400">
                                Due{" "}
                                {new Date(invoice.due_at).toLocaleDateString(
                                    "de-DE",
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                            {!invoice.status.includes("paid") &&
                                invoice.status !== "void" && (
                                    <Link
                                        href={`/invoices/${invoice.id}/edit`}
                                        className="text-xs text-indigo-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                )}
                            {invoice.status === "draft" && (
                                <button
                                    onClick={() =>
                                        router.post(
                                            `/invoices/${invoice.id}/send`,
                                            {},
                                            { preserveScroll: true },
                                        )
                                    }
                                    className="text-xs text-green-600 hover:underline"
                                >
                                    Send
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
