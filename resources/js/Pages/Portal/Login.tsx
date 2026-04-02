import { Head, useForm, usePage } from "@inertiajs/react";
import { type PageProps } from "@/types";

export default function PortalLogin() {
    const { flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post("/portal/login");
    }

    return (
        <>
            <Head title="Client Portal" />
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h1 className="text-2xl font-bold text-primary tracking-tight mb-2">
                        Client Portal
                    </h1>
                    <p className="text-gray-500 text-sm mb-8">
                        Enter your email to receive a secure login link.
                    </p>

                    {flash.success && (
                        <div className="mb-6 p-3 rounded-lg bg-green-50 text-green-800 text-sm border border-green-200">
                            {flash.success}
                        </div>
                    )}

                    {flash.error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-800 text-sm border border-red-200">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="your@email.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                        >
                            {processing ? "Sending link…" : "Send Login Link"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
