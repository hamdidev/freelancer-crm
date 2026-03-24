import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import ProposalEditor from "@/Components/ProposalEditor/ProposalEditor";
import {
    type Proposal,
    type ContentBlock,
    PROPOSAL_STATUS_COLORS,
    PROPOSAL_STATUS_LABELS,
} from "@/types";

interface Props {
    proposal: Proposal;
    clients: {
        id: number;
        contact_name: string;
        company_name: string | null;
    }[];
}

export default function ProposalsEdit({ proposal, clients }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        title: proposal.title,
        client_id: String(proposal.client_id),
        content: proposal.content,
        valid_until: proposal.valid_until ?? "",
    });

    const totalCents = (data.content as ContentBlock[]).reduce((sum, block) => {
        if (block.type === "pricing_item") {
            return sum + block.attrs.quantity * block.attrs.unit_price_cents;
        }
        return sum;
    }, 0);

    function save(e: React.FormEvent) {
        e.preventDefault();
        patch(`/proposals/${proposal.id}`);
    }

    function sendProposal() {
        if (!confirm("Send this proposal to the client?")) return;
        router.post(
            `/proposals/${proposal.id}/send`,
            {},
            { preserveScroll: true },
        );
    }

    return (
        <AppLayout title="Edit Proposal">
            <Head title="Edit Proposal" />

            <div className="max-w-4xl">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${PROPOSAL_STATUS_COLORS[proposal.status]}`}
                        >
                            {PROPOSAL_STATUS_LABELS[proposal.status]}
                        </span>
                        <span className="text-sm text-gray-500">
                            Total:{" "}
                            <strong className="text-gray-900">
                                €
                                {(totalCents / 100).toLocaleString("de-DE", {
                                    minimumFractionDigits: 2,
                                })}
                            </strong>
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={`/p/${proposal.token}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Preview ↗
                        </a>
                        {proposal.status === "draft" && (
                            <button
                                type="button"
                                onClick={sendProposal}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Send to Client
                            </button>
                        )}
                    </div>
                </div>

                <form onSubmit={save} className="space-y-6">
                    {/* Meta */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client
                            </label>
                            <select
                                value={data.client_id}
                                onChange={(e) =>
                                    setData("client_id", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {clients.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.company_name ?? c.contact_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valid Until
                            </label>
                            <input
                                type="date"
                                value={data.valid_until}
                                onChange={(e) =>
                                    setData("valid_until", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Editor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content
                        </label>
                        <ProposalEditor
                            content={data.content}
                            onChange={(content) => setData("content", content)}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <a
                            href="/proposals"
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Back
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {processing ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
