import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function ClientsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        contact_name: "",
        company_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "DE",
        vat_number: "",
        notes: "",
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post("/clients");
    }

    return (
        <AppLayout title="New Client">
            <Head title="New Client" />

            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-gray-800 mb-2">
                        Contact Details
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.contact_name}
                                onChange={(e) =>
                                    setData("contact_name", e.target.value)
                                }
                                placeholder="John Müller"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                required
                            />
                            {errors.contact_name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.contact_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={data.company_name}
                                onChange={(e) =>
                                    setData("company_name", e.target.value)
                                }
                                placeholder="Müller GmbH"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="john@mueller.de"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                placeholder="+49 30 12345678"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-gray-800 mb-2">
                        Address & Tax
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                placeholder="Unter den Linden 1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) =>
                                    setData("city", e.target.value)
                                }
                                placeholder="Berlin"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country
                            </label>
                            <select
                                value={data.country}
                                onChange={(e) =>
                                    setData("country", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            >
                                <option value="DE">Germany</option>
                                <option value="AT">Austria</option>
                                <option value="CH">Switzerland</option>
                                <option value="TR">Turkey</option>
                                <option value="GB">United Kingdom</option>
                                <option value="US">United States</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                VAT Number (USt-IdNr)
                            </label>
                            <input
                                type="text"
                                value={data.vat_number}
                                onChange={(e) =>
                                    setData("vat_number", e.target.value)
                                }
                                placeholder="DE123456789"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                    </label>
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        rows={3}
                        placeholder="Any notes about this client…"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        href="/clients"
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {processing ? "Creating…" : "Create Client"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}
