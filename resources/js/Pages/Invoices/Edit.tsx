import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import InvoiceItemsEditor from "@/Components/InvoiceItemsEditor";
import DateInput from "@/Components/DateInput";
import { type Invoice, type InvoiceItem } from "@/types";

interface Props {
    invoice: Invoice;
    clients: {
        id: number;
        contact_name: string;
        company_name: string | null;
    }[];
}

export default function InvoicesEdit({ invoice, clients }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        client_id: String(invoice.client_id),
        items: (invoice.items ?? []).map((item, index) => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unit_price_cents: item.unit_price_cents,
            total_cents: item.total_cents,
            position: item.position ?? index,
            time_entry_ids: item.time_entry_ids ?? null,
        })) as InvoiceItem[],
        tax_rate: Number(invoice.tax_rate),
        issue_date: invoice.issue_date,
        due_at: invoice.due_at,
        service_date: invoice.service_date ?? "",
        notes: invoice.notes ?? "",
    });

    const subtotal = data.items.reduce((sum, item) => sum + item.total_cents, 0);
    const tax = Math.round(subtotal * (data.tax_rate / 100));
    const total = subtotal + tax;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        patch(route("invoices.update", invoice.id));
    }

    return (
        <AppLayout title={`Edit ${invoice.number}`}>
            <Head title={`Edit ${invoice.number}`} />

            <form onSubmit={submit} className="max-w-4xl space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.client_id}
                            onChange={(e) => setData("client_id", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="">- Select client -</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.company_name ?? client.contact_name}
                                </option>
                            ))}
                        </select>
                        {errors.client_id && (
                            <p className="mt-1 text-xs text-red-500">{errors.client_id}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            VAT Rate (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={data.tax_rate}
                            onChange={(e) => setData("tax_rate", Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <DateInput
                        label="Issue Date"
                        value={data.issue_date}
                        onChange={(value) => setData("issue_date", value)}
                    />

                    <DateInput
                        label="Due Date"
                        value={data.due_at}
                        onChange={(value) => setData("due_at", value)}
                        required
                    />

                    <DateInput
                        label="Service Date"
                        hint="Leistungsdatum - required by German law"
                        value={data.service_date}
                        onChange={(value) => setData("service_date", value)}
                    />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Line Items</h3>
                    <InvoiceItemsEditor
                        items={data.items}
                        currency={invoice.currency}
                        onChange={(items) => setData("items", items)}
                    />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex flex-col items-end gap-1 text-sm">
                        <div className="flex justify-between w-56">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="text-gray-800">
                                €
                                {(subtotal / 100).toLocaleString("de-DE", {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between w-56">
                            <span className="text-gray-500">VAT ({data.tax_rate}%)</span>
                            <span className="text-gray-800">
                                €
                                {(tax / 100).toLocaleString("de-DE", {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between w-56 pt-2 border-t border-gray-200 font-semibold text-base">
                            <span>Total</span>
                            <span>
                                €
                                {(total / 100).toLocaleString("de-DE", {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <a
                        href={route("invoices.index")}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        Cancel
                    </a>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {processing ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}
