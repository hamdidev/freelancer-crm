import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import PricingItemView from "./PricingItemView";

export const PricingItemNode = Node.create({
    name: "pricing_item",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            description: { default: "" },
            quantity: { default: 1 },
            unit_price_cents: { default: 0 },
        };
    },

    parseHTML() {
        return [{ tag: "pricing-item" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["pricing-item", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(PricingItemView);
    },
});
