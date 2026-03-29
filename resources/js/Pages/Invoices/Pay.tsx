import { Head } from "@inertiajs/react";
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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href + "?paid=1",
            },
            redirect: "if_required",
        });

        if (stripeError) {
            setError(stripeError.message ?? "Payment failed.");
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <p className="text-2xl mb-2">✓</p>
                <p className="text-green-800 font-semibold">
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
            <PaymentElement />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
                type="submit"
                disabled={loading || !stripe}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
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
    const stripePromise = loadStripe(stripeKey);

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
                            className="flex justify-between text-sm py-1"
                        >
                            <span className="text-gray-600">
                                {item.description} × {item.quantity}
                            </span>
                            <span className="text-gray-800">
                                €
                                {(item.total_cents / 100).toLocaleString(
                                    "de-DE",
                                    { minimumFractionDigits: 2 },
                                )}
                            </span>
                        </div>
                    ))}
                    <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-semibold">
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
                    <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Payment Details
                    </h2>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm invoice={invoice} />
                    </Elements>
                </div>
            </div>
        </PortalLayout>
    );
}
