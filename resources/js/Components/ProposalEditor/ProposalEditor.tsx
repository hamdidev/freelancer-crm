import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import { PricingItemNode } from "./PricingItemNode";
import { useEffect } from "react";
import { type ContentBlock } from "@/types";

interface Props {
    content: ContentBlock[];
    onChange: (content: ContentBlock[]) => void;
}

export default function ProposalEditor({ content, onChange }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: false }),
            Heading.configure({ levels: [1, 2, 3] }),
            Placeholder.configure({
                placeholder: "Start writing your proposal…",
            }),
            PricingItemNode,
        ],
        content: { type: "doc", content: content.length ? content : [] },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON().content as ContentBlock[]);
        },
    });

    // Sync external content changes (e.g. initial load)
    useEffect(() => {
        if (editor && content.length === 0) {
            editor.commands.clearContent();
        }
    }, []);

    function addPricingItem() {
        editor
            ?.chain()
            .focus()
            .insertContent({
                type: "pricing_item",
                attrs: { description: "", quantity: 1, unit_price_cents: 0 },
            })
            .run();
    }

    if (!editor) return null;

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 bg-gray-50 flex-wrap">
                {[
                    {
                        label: "B",
                        action: () => editor.chain().focus().toggleBold().run(),
                        active: editor.isActive("bold"),
                    },
                    {
                        label: "I",
                        action: () =>
                            editor.chain().focus().toggleItalic().run(),
                        active: editor.isActive("italic"),
                    },
                    {
                        label: "H1",
                        action: () =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 1 })
                                .run(),
                        active: editor.isActive("heading", { level: 1 }),
                    },
                    {
                        label: "H2",
                        action: () =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run(),
                        active: editor.isActive("heading", { level: 2 }),
                    },
                    {
                        label: "• List",
                        action: () =>
                            editor.chain().focus().toggleBulletList().run(),
                        active: editor.isActive("bulletList"),
                    },
                ].map(({ label, action, active }) => (
                    <button
                        key={label}
                        type="button"
                        onClick={action}
                        className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                            active
                                ? "bg-indigo-100 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {label}
                    </button>
                ))}

                <div className="w-px h-4 bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={addPricingItem}
                    className="px-3 py-1 text-xs rounded font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                >
                    + Pricing Item
                </button>
            </div>

            {/* Editor area */}
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none px-6 py-5 min-h-80 focus:outline-none"
            />
        </div>
    );
}
