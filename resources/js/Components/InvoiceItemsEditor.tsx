import { type InvoiceItem } from "@/types";

interface Props {
    items: InvoiceItem[];
    currency: string;
    onChange: (items: InvoiceItem[]) => void;
}

function emptyItem(): InvoiceItem {
    return {
        description: "",
        quantity: 1,
        unit_price_cents: 0,
        total_cents: 0,
        position: 0,
    };
}

export default function InvoiceItemsEditor({
    items,
    currency,
    onChange,
}: Props) {
    function update(index: number, field: keyof InvoiceItem, value: unknown) {
        const updated = items.map((item, i) => {
            if (i !== index) return item;
            const newItem = { ...item, [field]: value };
            newItem.total_cents = Math.round(
                Number(newItem.quantity) * Number(newItem.unit_price_cents),
            );
            return newItem;
        });
        onChange(updated);
    }

    function addItem() {
        onChange([...items, { ...emptyItem(), position: items.length }]);
    }

    function removeItem(index: number) {
        onChange(items.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-2">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-2 px-3 text-xs font-medium text-gray-500">
                <span className="col-span-5">Description</span>
                <span className="col-span-2 text-right">Qty</span>
                <span className="col-span-3 text-right">Unit Price</span>
                <span className="col-span-2 text-right">Total</span>
            </div>

            {items.map((item, i) => (
                <div
                    key={i}
                    className="grid grid-cols-12 gap-2 items-center group"
                >
                    <div className="col-span-5">
                        <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                                update(i, "description", e.target.value)
                            }
                            placeholder="Service or product description"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div className="col-span-2">
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) =>
                                update(
                                    i,
                                    "quantity",
                                    parseFloat(e.target.value) || 0,
                                )
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div className="col-span-3">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                €
                            </span>
                            <input
                                type="number"
                                min="0"
                                value={item.unit_price_cents / 100}
                                onChange={(e) =>
                                    update(
                                        i,
                                        "unit_price_cents",
                                        Math.round(
                                            parseFloat(e.target.value || "0") *
                                                100,
                                        ),
                                    )
                                }
                                className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                        <span className="text-sm font-medium text-gray-800">
                            €
                            {(item.total_cents / 100).toLocaleString("de-DE", {
                                minimumFractionDigits: 2,
                            })}
                        </span>
                        <button
                            type="button"
                            onClick={() => removeItem(i)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-sm transition-opacity"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addItem}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium py-1"
            >
                + Add line item
            </button>
        </div>
    );
}
