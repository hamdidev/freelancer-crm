import { Head, useForm, router } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import { type Contract } from "@/types";

interface Props {
    contract: Contract;
}

export default function ContractSign({ contract }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawing, setDrawing] = useState(false);
    const [hasSigned, setHasSigned] = useState(false);
    const [showReject, setShowReject] = useState(false);

    const brandColor = contract.user?.brand_color ?? "#1A4F8B";
    const isTerminal = ["signed", "rejected"].includes(contract.status);

    const { data, setData, processing } = useForm({
        reason: "",
    });

    // Canvas drawing setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.strokeStyle = "#0F172A";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
    }, []);

    function startDrawing(e: React.MouseEvent<HTMLCanvasElement>) {
        setDrawing(true);
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    function draw(e: React.MouseEvent<HTMLCanvasElement>) {
        if (!drawing) return;
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext("2d")!;
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        setHasSigned(true);
    }

    function stopDrawing() {
        setDrawing(false);
    }

    function clearSignature() {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSigned(false);
    }

    function handleSign() {
        const canvas = canvasRef.current!;
        const signature = canvas.toDataURL("image/png");
        router.post(`/contracts/${contract.token}/sign`, {
            action: "sign",
            signature,
            reason: "",
        });
    }

    function handleReject(e: React.FormEvent) {
        e.preventDefault();
        router.post(`/contracts/${contract.token}/sign`, {
            action: "reject",
            signature: "",
            reason: data.reason,
        });
    }

    return (
        <>
            <Head title={`Sign: ${contract.title}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Branded header */}
                <header
                    className="h-14 flex items-center px-8 shadow-sm"
                    style={{ backgroundColor: brandColor }}
                >
                    <span className="text-white font-semibold">
                        {contract.user?.company_name ?? contract.user?.name}
                    </span>
                    <span className="ml-auto text-white/70 text-sm">
                        Contract for Signing
                    </span>
                </header>

                <main className="max-w-3xl mx-auto px-6 py-10">
                    {/* Contract header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {contract.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                                For{" "}
                                {contract.client?.company_name ??
                                    contract.client?.contact_name}
                            </span>
                            {contract.sent_at && (
                                <span>
                                    Sent{" "}
                                    {new Date(
                                        contract.sent_at,
                                    ).toLocaleDateString("de-DE")}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Contract body */}
                    <div
                        className="bg-white rounded-xl border border-gray-200 p-8 mb-8 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: contract.body }}
                    />

                    {/* Terminal state banner */}
                    {contract.status === "signed" && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">✓</span>
                                <div>
                                    <p className="text-green-800 font-semibold text-lg">
                                        Contract Signed
                                    </p>
                                    <p className="text-green-600 text-sm">
                                        Signed on{" "}
                                        {contract.signed_at
                                            ? new Date(
                                                  contract.signed_at,
                                              ).toLocaleDateString("de-DE")
                                            : "—"}
                                        {contract.signer_ip &&
                                            ` · IP: ${contract.signer_ip}`}
                                    </p>
                                </div>
                            </div>

                            {/* Signature image */}
                            {contract.signature_path && (
                                <div className="mt-4 pt-4 border-t border-green-200">
                                    <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3">
                                        Electronic Signature
                                    </p>
                                    <div className="bg-white rounded-lg border border-green-200 p-4 inline-block">
                                        <img
                                            src={`/contracts/${contract.token}/signature`}
                                            alt="Client signature"
                                            className="max-h-24 max-w-xs"
                                        />
                                    </div>
                                    {contract.document_hash && (
                                        <p className="text-xs text-green-600 mt-2 font-mono">
                                            Document hash:{" "}
                                            {contract.document_hash.slice(
                                                0,
                                                32,
                                            )}
                                            ...
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {contract.status === "rejected" && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
                            <p className="text-red-800 font-semibold">
                                Contract Rejected
                            </p>
                            {contract.rejection_reason && (
                                <p className="text-red-600 text-sm mt-1">
                                    {contract.rejection_reason}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Signing area */}
                    {!isTerminal && !showReject && (
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                Sign Contract
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Draw your signature below. By signing, you agree
                                to the terms above. This constitutes a legally
                                binding electronic signature under EU eIDAS
                                regulations.
                            </p>

                            {/* Canvas */}
                            <div className="border-2 border-gray-200 rounded-xl overflow-hidden mb-4 bg-gray-50">
                                <canvas
                                    ref={canvasRef}
                                    width={700}
                                    height={200}
                                    className="w-full cursor-crosshair touch-none"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <button
                                    type="button"
                                    onClick={clearSignature}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Clear signature
                                </button>
                                <p className="text-xs text-gray-400">
                                    IP: {window.location.hostname} •{" "}
                                    {new Date().toLocaleDateString("de-DE")}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={handleSign}
                                    disabled={!hasSigned || processing}
                                    className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-colors"
                                    style={{ backgroundColor: brandColor }}
                                >
                                    {processing ? "Signing…" : "Sign Contract"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReject(true)}
                                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Reject form */}
                    {showReject && !isTerminal && (
                        <div className="bg-white rounded-xl border border-red-200 p-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Reject Contract
                            </h2>
                            <form onSubmit={handleReject}>
                                <textarea
                                    value={data.reason}
                                    onChange={(e) =>
                                        setData("reason", e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Please explain why you are rejecting this contract (optional)…"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowReject(false)}
                                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        {processing
                                            ? "Submitting…"
                                            : "Confirm Rejection"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
