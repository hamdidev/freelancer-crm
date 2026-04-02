import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/Layouts/AppLayout";
import {
    type ClientFull,
    type Lead,
    type Proposal,
    type Invoice,
    type Contract,
    LEAD_STATUS_COLORS,
    LEAD_STATUS_LABELS,
    PROPOSAL_STATUS_COLORS,
    PROPOSAL_STATUS_LABELS,
    INVOICE_STATUS_COLORS,
    INVOICE_STATUS_LABELS,
    CONTRACT_STATUS_COLORS,
    CONTRACT_STATUS_LABELS,
} from "@/types";

interface Props {
    client: ClientFull & {
        leads: Lead[];
        proposals: Proposal[];
        invoices: Invoice[];
        contracts: Contract[];
    };
}

export default function ClientsShow({ client }: Props) {
    return (
        <AppLayout title={client.company_name ?? client.contact_name}>
            <Head title={client.company_name ?? client.contact_name} />

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                        {(client.company_name ?? client.contact_name)
                            .charAt(0)
                            .toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {client.company_name ?? client.contact_name}
                        </h1>
                        {client.company_name && (
                            <p className="text-gray-500">
                                {client.contact_name}
                            </p>
                        )}
                        <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    {client.portal_enabled && (
                        <button
                            onClick={() => {
                                if (
                                    confirm(
                                        `Send portal link to ${client.email}?`,
                                    )
                                ) {
                                    router.post(
                                        route("portal.send"),
                                        { client_id: client.id },
                                        { preserveScroll: true },
                                    );
                                }
                            }}
                            className="px-4 py-2 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Send Portal Link
                        </button>
                    )}
                    <Link
                        href={`/clients/${client.id}/edit`}
                        className="px-4 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:opacity-90 transition-all"
                    >
                        Edit Client
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Left — client info */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">
                            Details
                        </h3>
                        <div className="space-y-3 text-sm">
                            {client.phone && (
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                                        Phone
                                    </p>
                                    <p className="text-gray-800">
                                        {client.phone}
                                    </p>
                                </div>
                            )}
                            {client.city && (
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                                        Location
                                    </p>
                                    <p className="text-gray-800">
                                        {client.city}, {client.country}
                                    </p>
                                </div>
                            )}
                            {client.address && (
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                                        Address
                                    </p>
                                    <p className="text-gray-800">
                                        {client.address}
                                    </p>
                                </div>
                            )}
                            {client.vat_number && (
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                                        VAT Number
                                    </p>
                                    <p className="text-gray-800">
                                        {client.vat_number}
                                    </p>
                                </div>
                            )}
                            {client.notes && (
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                                        Notes
                                    </p>
                                    <p className="text-gray-600 text-xs">
                                        {client.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-2">
                            <Link
                                href={`/proposals/create?client_id=${client.id}`}
                                className="block w-full px-3 py-2 text-sm text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                + New Proposal
                            </Link>
                            <Link
                                href={`/invoices/create?client_id=${client.id}`}
                                className="block w-full px-3 py-2 text-sm text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                + New Invoice
                            </Link>
                            <Link
                                href={`/contracts/create?client_id=${client.id}`}
                                className="block w-full px-3 py-2 text-sm text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                + New Contract
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right — activity */}
                <div className="col-span-2 space-y-6">
                    {/* Proposals */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-800">
                                Proposals ({client.proposals.length})
                            </h3>
                            <Link
                                href={`/proposals/create?client_id=${client.id}`}
                                className="text-xs text-primary hover:underline"
                            >
                                + New
                            </Link>
                        </div>
                        {client.proposals.length === 0 && (
                            <p className="px-6 py-4 text-xs text-gray-400">
                                No proposals yet.
                            </p>
                        )}
                        {client.proposals.map((p, i) => (
                            <div
                                key={p.id}
                                className={`flex items-center gap-3 px-6 py-3 ${i < client.proposals.length - 1 ? "border-b border-gray-50" : ""}`}
                            >
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${PROPOSAL_STATUS_COLORS[p.status]}`}
                                >
                                    {PROPOSAL_STATUS_LABELS[p.status]}
                                </span>
                                <span className="flex-1 text-sm text-gray-800">
                                    {p.title}
                                </span>
                                <span className="text-sm font-semibold text-gray-700">
                                    €
                                    {(p.total_cents / 100).toLocaleString(
                                        "de-DE",
                                        { minimumFractionDigits: 2 },
                                    )}
                                </span>
                                <Link
                                    href={`/proposals/${p.id}/edit`}
                                    className="text-xs text-primary hover:underline"
                                >
                                    View
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Invoices */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-800">
                                Invoices ({client.invoices.length})
                            </h3>
                            <Link
                                href={`/invoices/create?client_id=${client.id}`}
                                className="text-xs text-primary hover:underline"
                            >
                                + New
                            </Link>
                        </div>
                        {client.invoices.length === 0 && (
                            <p className="px-6 py-4 text-xs text-gray-400">
                                No invoices yet.
                            </p>
                        )}
                        {client.invoices.map((inv, i) => (
                            <div
                                key={inv.id}
                                className={`flex items-center gap-3 px-6 py-3 ${i < client.invoices.length - 1 ? "border-b border-gray-50" : ""}`}
                            >
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${INVOICE_STATUS_COLORS[inv.status]}`}
                                >
                                    {INVOICE_STATUS_LABELS[inv.status]}
                                </span>
                                <span className="flex-1 text-sm text-gray-800">
                                    {inv.number}
                                </span>
                                <span className="text-sm font-semibold text-gray-700">
                                    €
                                    {(inv.total_cents / 100).toLocaleString(
                                        "de-DE",
                                        { minimumFractionDigits: 2 },
                                    )}
                                </span>
                                <Link
                                    href={`/invoices/${inv.id}/edit`}
                                    className="text-xs text-primary hover:underline"
                                >
                                    View
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Contracts */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-800">
                                Contracts ({client.contracts.length})
                            </h3>
                        </div>
                        {client.contracts.length === 0 && (
                            <p className="px-6 py-4 text-xs text-gray-400">
                                No contracts yet.
                            </p>
                        )}
                        {client.contracts.map((c, i) => (
                            <div
                                key={c.id}
                                className={`flex items-center gap-3 px-6 py-3 ${i < client.contracts.length - 1 ? "border-b border-gray-50" : ""}`}
                            >
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${CONTRACT_STATUS_COLORS[c.status]}`}
                                >
                                    {CONTRACT_STATUS_LABELS[c.status]}
                                </span>
                                <span className="flex-1 text-sm text-gray-800">
                                    {c.title}
                                </span>
                                <a
                                    href={`/contracts/${c.token}/sign`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                    View ↗
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
