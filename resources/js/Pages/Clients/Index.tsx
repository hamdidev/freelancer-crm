import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/Layouts/AppLayout";
import { type ClientFull } from "@/types";

interface Props {
    clients: ClientFull[];
}

export default function ClientsIndex({ clients }: Props) {
    return (
        <AppLayout title="Clients">
            <Head title="Clients" />

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">
                    {clients.length} clients
                </p>
                <Link
                    href="/clients/create"
                    className="px-4 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:opacity-90 transition-all"
                >
                    + New Client
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {clients.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <p className="text-gray-400 text-sm">No clients yet.</p>
                        <Link
                            href="/clients/create"
                            className="mt-2 inline-block text-sm text-primary hover:underline"
                        >
                            Add your first client →
                        </Link>
                    </div>
                )}

                {clients.map((client, i) => (
                    <div
                        key={client.id}
                        className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
                            i < clients.length - 1
                                ? "border-b border-gray-100"
                                : ""
                        }`}
                    >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                            {(client.company_name ?? client.contact_name)
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        {/* Name + email */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">
                                {client.company_name ?? client.contact_name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {client.company_name && (
                                    <span className="mr-2">
                                        {client.contact_name}
                                    </span>
                                )}
                                {client.email}
                            </p>
                        </div>

                        {/* Location */}
                        {client.city && (
                            <span className="text-xs text-gray-400 flex-shrink-0">
                                {client.city}, {client.country}
                            </span>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {[
                                { label: "Leads", count: client.leads_count },
                                {
                                    label: "Proposals",
                                    count: client.proposals_count,
                                },
                                {
                                    label: "Invoices",
                                    count: client.invoices_count,
                                },
                            ].map(({ label, count }) => (
                                <div key={label} className="text-center">
                                    <p className="text-sm font-bold text-gray-700">
                                        {count ?? 0}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <Link
                                href={`/clients/${client.id}`}
                                className="text-xs text-primary hover:underline"
                            >
                                View
                            </Link>
                            <Link
                                href={`/clients/${client.id}/edit`}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                Edit
                            </Link>
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
                                className="text-xs text-indigo-500 hover:text-indigo-700"
                            >
                                Send Portal Link
                            </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
