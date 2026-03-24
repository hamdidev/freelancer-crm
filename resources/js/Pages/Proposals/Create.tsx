import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import ProposalEditor from "@/Components/ProposalEditor/ProposalEditor";
import { type ContentBlock } from "@/types";

interface Client {
    id: number;
    contact_name: string;
    company_name: string | null;
}

interface Props {
    clients: Client[];
    prefill: { lead_id?: string; client_id?: string; title?: string };
}

export default function ProposalsCreate({ clients, prefill }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: prefill.client_id ?? "",
        lead_id: prefill.lead_id ?? "",
        title: prefill.title ?? "",
        content: [] as ContentBlock[],
        valid_until: "",
        currency: "EUR",
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post("/proposals");
    }

    return (
        <AppLayout title="New Proposal">
            <Head title="New Proposal" />

            <form onSubmit={submit} className="max-w-4xl space-y-6">
                {/* Meta fields */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.client_id}
                            onChange={(e) =>
                                setData("client_id", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="">— Select client —</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.company_name ?? c.contact_name}
                                </option>
                            ))}
                        </select>
                        {errors.client_id && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.client_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="e.g. Website Redesign Proposal"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.title}
                            </p>
                        )}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Currency
                        </label>
                        <select
                            value={data.currency}
                            onChange={(e) =>
                                setData("currency", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="EUR">EUR — Euro</option>
                            <option value="USD">USD — US Dollar</option>
                            <option value="GBP">GBP — British Pound</option>
                            <option value="TRY">TRY — Turkish Lira</option>
                        </select>
                    </div>
                </div>

                {/* Editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proposal Content
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
                        Cancel
                    </a>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {processing ? "Creating…" : "Create & Edit"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}
