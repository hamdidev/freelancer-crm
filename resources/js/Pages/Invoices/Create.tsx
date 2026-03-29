import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import InvoiceItemsEditor from "@/Components/InvoiceItemsEditor";
import { type InvoiceItem } from "@/types";
import DateInput from "@/Components/DateInput";

function formatDateForInput(date: Date): string {
    return date.toISOString().split("T")[0]; // always YYYY-MM-DD
}
interface Client {
    id: number;
    contact_name: string;
    company_name: string | null;
}

interface Props {
    clients: Client[];
    defaults: { tax_rate: number; currency: string; due_days: number };
}

export default function InvoicesCreate({ clients, defaults }: Props) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + defaults.due_days);

    const { data, setData, post, processing, errors } = useForm({
        client_id: "",
        items: [
            {
                description: "",
                quantity: 1,
                unit_price_cents: 0,
                total_cents: 0,
                position: 0,
            },
        ] as InvoiceItem[],
        tax_rate: defaults.tax_rate,
        currency: defaults.currency,
        issue_date: formatDateForInput(new Date()), // today in YYYY-MM-DD
        due_at: formatDateForInput(dueDate), // today + due_days
        service_date: "",
        notes: "",
        recurring: false,
        recurring_interval: "",
    });

    const subtotal = data.items.reduce((s, i) => s + i.total_cents, 0);
    const tax = Math.round(subtotal * (data.tax_rate / 100));
    const total = subtotal + tax;

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post("/invoices");
    }

    return (
        <AppLayout title="New Invoice">
            <Head title="New Invoice" />

            <form onSubmit={submit} className="max-w-4xl space-y-6">
                {/* Meta */}
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

                    <div>
                        <DateInput
                            label="Issue Date"
                            value={data.issue_date}
                            onChange={(v) => setData("issue_date", v)}
                        />
                    </div>

                    <div>
                        <DateInput
                            label="Due Date"
                            value={data.due_at}
                            onChange={(v) => setData("due_at", v)}
                            required
                        />
                    </div>

                    <div>
                        {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Date
                            <span className="ml-1 text-xs text-gray-400">
                                (Leistungsdatum — required by German law)
                            </span>
                        </label> */}
                        <DateInput
                            label="Service Date"
                            hint="Leistungsdatum — required by German law"
                            value={data.service_date}
                            onChange={(v) => setData("service_date", v)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            VAT Rate (%)
                            <span className="ml-1 text-xs text-gray-400">
                                (Mehrwertsteuer)
                            </span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={data.tax_rate}
                            onChange={(e) =>
                                setData("tax_rate", parseFloat(e.target.value))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Line items */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">
                        Line Items
                    </h3>
                    <InvoiceItemsEditor
                        items={data.items}
                        currency={data.currency}
                        onChange={(items) => setData("items", items)}
                    />
                </div>

                {/* Totals */}
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
                            <span className="text-gray-500">
                                VAT ({data.tax_rate}%)
                            </span>
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

                {/* Notes */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                    </label>
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        rows={3}
                        placeholder="Payment instructions, bank details, thank you note…"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <a
                        href="/invoices"
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        Cancel
                    </a>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {processing ? "Creating…" : "Create Invoice"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}
