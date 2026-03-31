import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import PortalLayout from "@/Layouts/PortalLayout";
import { type Invoice } from "@/types";

interface Props {
    invoice: Invoice;
    clientSecret: string;
    stripeKey: string;
}

function CheckoutForm({ invoice }: { invoice: Invoice }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ready, setReady] = useState(false);

    async function confirmWithServer() {
        await fetch(
            route("portal.invoices.confirm-payment", invoice.id),
            { method: "POST", headers: { "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? "" } },
        );
    }

    // Check URL params for Stripe redirect result (3D Secure etc.)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("payment_intent_client_secret")) {
            confirmWithServer().then(() => setSuccess(true));
        }
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!stripe || !elements || !ready) {
            setError("Payment form is not ready yet. Please wait.");
            return;
        }

        setLoading(true);
        setError(null);

        // Submit elements first
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message ?? "Submission failed.");
            setLoading(false);
            return;
        }

        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + window.location.pathname + "?paid=1",
            },
            redirect: "if_required",
        });

        if (stripeError) {
            setError(stripeError.message ?? "Payment failed.");
            setLoading(false);
        } else {
            await confirmWithServer();
            setSuccess(true);
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <p className="text-4xl mb-3">✓</p>
                <p className="text-green-800 font-semibold text-lg">
                    Payment successful!
                </p>
                <p className="text-green-600 text-sm mt-1">
                    Thank you. Invoice {invoice.number} has been paid.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement
                onReady={() => setReady(true)} // mark as ready when mounted
            />

            {!ready && (
                <p className="text-sm text-gray-400 text-center">
                    Loading payment form…
                </p>
            )}

            {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading || !stripe || !ready}
                className="w-full py-3 bg-primary text-on-primary font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
            >
                {loading
                    ? "Processing…"
                    : `Pay €${(invoice.total_cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`}
            </button>
        </form>
    );
}

export default function InvoicePay({
    invoice,
    clientSecret,
    stripeKey,
}: Props) {
    const [stripePromise] = useState(() => loadStripe(stripeKey));

    return (
        <PortalLayout title={`Pay Invoice ${invoice.number}`}>
            <Head title={`Pay ${invoice.number}`} />

            <div className="max-w-lg mx-auto">
                {/* Invoice summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Invoice Summary
                    </h2>
                    {invoice.items?.map((item, i) => (
                        <div
                            key={i}
                            className="flex justify-between text-sm py-2 border-b border-gray-50"
                        >
                            <span className="text-gray-600">
                                {item.description} × {item.quantity}
                            </span>
                            <span className="text-gray-800 font-medium">
                                €
                                {(item.total_cents / 100).toLocaleString(
                                    "de-DE",
                                    { minimumFractionDigits: 2 },
                                )}
                            </span>
                        </div>
                    ))}
                    <div className="flex justify-between font-semibold mt-3 pt-2">
                        <span>Total</span>
                        <span>
                            €
                            {(invoice.total_cents / 100).toLocaleString(
                                "de-DE",
                                { minimumFractionDigits: 2 },
                            )}
                        </span>
                    </div>
                </div>

                {/* Stripe Elements */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-6">
                        Payment Details
                    </h2>
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: {
                                theme: "stripe",
                                variables: {
                                    colorPrimary: "#1A4F8B",
                                    borderRadius: "8px",
                                },
                            },
                        }}
                    >
                        <CheckoutForm invoice={invoice} />
                    </Elements>
                </div>
            </div>
        </PortalLayout>
    );
}
