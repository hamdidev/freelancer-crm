import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    type Proposal,
    PROPOSAL_STATUS_COLORS,
    PROPOSAL_STATUS_LABELS,
} from "@/types";

interface Props {
    proposals: Proposal[];
}

export default function ProposalsIndex({ proposals }: Props) {
    return (
        <AppLayout title="Proposals">
            <Head title="Proposals" />

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">
                    {proposals.length} proposals
                </p>
                <Link
                    href="/proposals/create"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + New Proposal
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {proposals.length === 0 && (
                    <div className="px-6 py-12 text-center">
                        <p className="text-gray-400 text-sm">
                            No proposals yet.
                        </p>
                        <Link
                            href="/proposals/create"
                            className="mt-3 inline-block text-sm text-indigo-600 hover:underline"
                        >
                            Create your first proposal →
                        </Link>
                    </div>
                )}

                {proposals.map((proposal, i) => (
                    <div
                        key={proposal.id}
                        className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
                            i < proposals.length - 1
                                ? "border-b border-gray-100"
                                : ""
                        }`}
                    >
                        {/* Status badge */}
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${PROPOSAL_STATUS_COLORS[proposal.status]}`}
                        >
                            {PROPOSAL_STATUS_LABELS[proposal.status]}
                        </span>

                        {/* Title + client */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {proposal.title}
                            </p>
                            <p className="text-xs text-gray-500">
                                {proposal.client?.company_name ??
                                    proposal.client?.contact_name}
                            </p>
                        </div>

                        {/* Value */}
                        <span className="text-sm font-semibold text-gray-800 flex-shrink-0">
                            €
                            {(proposal.total_cents / 100).toLocaleString(
                                "de-DE",
                                { minimumFractionDigits: 2 },
                            )}
                        </span>

                        {/* Date */}
                        <span className="text-xs text-gray-400 flex-shrink-0 w-24 text-right">
                            {new Date(proposal.created_at).toLocaleDateString(
                                "de-DE",
                            )}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {proposal.status === "draft" ||
                            proposal.status === "sent" ? (
                                <Link
                                    href={`/proposals/${proposal.id}/edit`}
                                    className="text-xs text-indigo-600 hover:underline"
                                >
                                    Edit
                                </Link>
                            ) : null}
                            <a
                                href={`/p/${proposal.token}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                Preview ↗
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
