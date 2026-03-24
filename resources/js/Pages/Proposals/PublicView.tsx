import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { type Proposal } from "@/types";

interface Props {
    proposal: Proposal;
}

export default function PublicView({ proposal }: Props) {
    const [showActionForm, setShowActionForm] = useState(false);
    const [pendingAction, setPendingAction] = useState<
        "accept" | "decline" | null
    >(null);

    const { data, setData, post, processing } = useForm({
        action: "" as "accept" | "decline",
        note: "",
    });

    const brandColor = proposal.user?.brand_color ?? "#6366f1";
    const isTerminal = ["accepted", "declined", "expired"].includes(
        proposal.status,
    );

    function handleAction(action: "accept" | "decline") {
        setPendingAction(action);
        setData("action", action);
        setShowActionForm(true);
    }

    function submitAction(e: React.FormEvent) {
        e.preventDefault();
        post(`/p/${proposal.token}/action`);
    }

    return (
        <>
            <Head title={proposal.title} />

            <div className="min-h-screen bg-gray-50">
                {/* Branded header */}
                <header
                    className="h-14 flex items-center px-8 shadow-sm"
                    style={{ backgroundColor: brandColor }}
                >
                    <span className="text-white font-semibold">
                        {proposal.user?.company_name ?? proposal.user?.name}
                    </span>
                    <span className="ml-auto text-white/70 text-sm">
                        Proposal
                    </span>
                </header>

                <main className="max-w-3xl mx-auto px-6 py-10">
                    {/* Proposal header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {proposal.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                                Prepared for{" "}
                                {proposal.client?.company_name ??
                                    proposal.client?.contact_name}
                            </span>
                            {proposal.valid_until && (
                                <span>
                                    Valid until{" "}
                                    {new Date(
                                        proposal.valid_until,
                                    ).toLocaleDateString("de-DE")}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content blocks */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 prose prose-sm max-w-none">
                        {proposal.content.map((block, i) => {
                            if (block.type === "pricing_item") {
                                const {
                                    description,
                                    quantity,
                                    unit_price_cents,
                                } = block.attrs;
                                const total =
                                    (quantity * unit_price_cents) / 100;
                                return (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center py-2 border-b border-gray-100 not-prose"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {description}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {quantity} × €
                                                {(
                                                    unit_price_cents / 100
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            €
                                            {total.toLocaleString("de-DE", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                );
                            }
                            if (block.type === "paragraph") {
                                return (
                                    <p key={i}>
                                        {block.content
                                            ?.map((c) => c.text)
                                            .join("")}
                                    </p>
                                );
                            }
                            if (block.type === "heading") {
                                const Tag =
                                    `h${block.attrs.level}` as keyof JSX.IntrinsicElements;
                                return (
                                    <Tag key={i}>
                                        {block.content
                                            ?.map((c: any) => c.text)
                                            .join("")}
                                    </Tag>
                                );
                            }
                            return null;
                        })}
                    </div>

                    {/* Total */}
                    <div className="bg-white rounded-xl border border-gray-200 px-8 py-4 mb-8 flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-700">
                            Total
                        </span>
                        <span className="text-2xl font-bold text-gray-900">
                            €
                            {(proposal.total_cents / 100).toLocaleString(
                                "de-DE",
                                { minimumFractionDigits: 2 },
                            )}
                            <span className="text-sm font-normal text-gray-400 ml-1">
                                {proposal.currency}
                            </span>
                        </span>
                    </div>

                    {/* Action buttons */}
                    {!isTerminal && !showActionForm && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleAction("accept")}
                                className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-colors"
                                style={{ backgroundColor: brandColor }}
                            >
                                Accept Proposal
                            </button>
                            <button
                                onClick={() => handleAction("decline")}
                                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                            >
                                Decline
                            </button>
                        </div>
                    )}

                    {/* Status banner for terminal states */}
                    {isTerminal && (
                        <div
                            className={`rounded-xl p-4 text-center font-semibold text-sm ${
                                proposal.status === "accepted"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                            {proposal.status === "accepted" &&
                                "✓ You accepted this proposal"}
                            {proposal.status === "declined" &&
                                "✗ You declined this proposal"}
                            {proposal.status === "expired" &&
                                "This proposal has expired"}
                            {proposal.client_note && (
                                <p className="mt-1 font-normal text-xs opacity-70">
                                    {proposal.client_note}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Action form */}
                    {showActionForm && (
                        <form
                            onSubmit={submitAction}
                            className="bg-white rounded-xl border border-gray-200 p-6"
                        >
                            <h3 className="text-base font-semibold text-gray-900 mb-3">
                                {pendingAction === "accept"
                                    ? "Accept Proposal"
                                    : "Decline Proposal"}
                            </h3>
                            <textarea
                                value={data.note}
                                onChange={(e) =>
                                    setData("note", e.target.value)
                                }
                                rows={3}
                                placeholder={
                                    pendingAction === "accept"
                                        ? "Any message for the freelancer? (optional)"
                                        : "Let us know why you're declining (optional)"
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowActionForm(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-5 py-2 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                                        pendingAction === "accept"
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-red-600 hover:bg-red-700"
                                    }`}
                                >
                                    {processing
                                        ? "Submitting…"
                                        : pendingAction === "accept"
                                          ? "Confirm Accept"
                                          : "Confirm Decline"}
                                </button>
                            </div>
                        </form>
                    )}
                </main>
            </div>
        </>
    );
}
