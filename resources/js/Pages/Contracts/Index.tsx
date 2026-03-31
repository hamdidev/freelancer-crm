import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    type Contract,
    CONTRACT_STATUS_COLORS,
    CONTRACT_STATUS_LABELS,
} from "@/types";

interface Props {
    contracts: Contract[];
}

export default function ContractsIndex({ contracts }: Props) {
    return (
        <AppLayout title="Contracts">
            <Head title="Contracts" />

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">
                    {contracts.length} contracts
                </p>
                <Link
                    href="/contracts/create"
                    className="px-4 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:opacity-90 transition-all"
                >
                    + New Contract
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {contracts.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <p className="text-gray-400 text-sm">
                            No contracts yet.
                        </p>
                        <Link
                            href="/contracts/create"
                            className="mt-2 inline-block text-sm text-primary hover:underline"
                        >
                            Create your first contract →
                        </Link>
                    </div>
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

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {contract.title}
                            </p>
                            <p className="text-xs text-gray-500">
                                {contract.client?.company_name ??
                                    contract.client?.contact_name}
                            </p>
                        </div>

                        <span className="text-xs text-gray-400 flex-shrink-0">
                            {new Date(contract.created_at).toLocaleDateString(
                                "de-DE",
                            )}
                        </span>

                        <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Edit — draft and sent only */}
                            {(contract.status === "draft" ||
                                contract.status === "sent") && (
                                <Link
                                    href={`/contracts/${contract.id}/edit`}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Edit
                                </Link>
                            )}

                            {/* Send — draft only */}
                            {contract.status === "draft" && (
                                <button
                                    onClick={() =>
                                        router.post(
                                            `/contracts/${contract.id}/send`,
                                            {},
                                            { preserveScroll: true },
                                        )
                                    }
                                    className="text-xs text-green-600 hover:underline"
                                >
                                    Send
                                </button>
                            )}

                            {/* Preview — draft and sent only */}
                            {(contract.status === "draft" ||
                                contract.status === "sent") && (
                                <a
                                    href={`/contracts/${contract.token}/sign`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                    Preview ↗
                                </a>
                            )}

                            {/* Signed details */}
                            {contract.status === "signed" && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-green-600 font-medium">
                                        ✓ Signed{" "}
                                        {contract.signed_at
                                            ? new Date(
                                                  contract.signed_at,
                                              ).toLocaleDateString("de-DE")
                                            : ""}
                                    </span>
                                    <a
                                        href={`/contracts/${contract.token}/sign`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        View ↗
                                    </a>
                                </div>
                            )}

                            {/* Rejected details */}
                            {contract.status === "rejected" && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-red-500 font-medium">
                                        ✗ Rejected{" "}
                                        {contract.rejected_at
                                            ? new Date(
                                                  contract.rejected_at,
                                              ).toLocaleDateString("de-DE")
                                            : ""}
                                    </span>
                                    {contract.rejection_reason && (
                                        <span
                                            title={contract.rejection_reason}
                                            className="text-xs text-gray-400 cursor-help underline decoration-dotted"
                                        >
                                            reason
                                        </span>
                                    )}
                                    <a
                                        href={`/contracts/${contract.token}/sign`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        View ↗
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
