import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";

interface Props {
    node: {
        attrs: {
            description: string;
            quantity: number;
            unit_price_cents: number;
        };
    };
    updateAttributes: (attrs: Record<string, unknown>) => void;
    deleteNode: () => void;
}

export default function PricingItemView({
    node,
    updateAttributes,
    deleteNode,
}: Props) {
    const { description, quantity, unit_price_cents } = node.attrs;
    const total = (quantity * unit_price_cents) / 100;

    return (
        <NodeViewWrapper>
            <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 my-2 group">
                <div className="flex-1">
                    <input
                        value={description}
                        onChange={(e) =>
                            updateAttributes({ description: e.target.value })
                        }
                        placeholder="Service description…"
                        className="w-full bg-transparent text-sm font-medium text-gray-800 focus:outline-none"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 flex-shrink-0">
                    <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) =>
                            updateAttributes({
                                quantity: parseInt(e.target.value) || 1,
                            })
                        }
                        className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                    <span className="text-gray-400">×</span>
                    <div className="flex items-center">
                        <span className="text-gray-400 text-xs mr-0.5">€</span>
                        <input
                            type="number"
                            min={0}
                            value={unit_price_cents / 100}
                            onChange={(e) =>
                                updateAttributes({
                                    unit_price_cents: Math.round(
                                        parseFloat(e.target.value || "0") * 100,
                                    ),
                                })
                            }
                            className="w-20 border border-gray-300 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        />
                    </div>
                    <span className="font-semibold text-gray-800 w-20 text-right">
                        €
                        {total.toLocaleString("de-DE", {
                            minimumFractionDigits: 2,
                        })}
                    </span>
                </div>
                <button
                    onClick={deleteNode}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs transition-opacity"
                >
                    ✕
                </button>
            </div>
        </NodeViewWrapper>
    );
}
