import { Head, useForm, Link } from "@inertiajs/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import AppLayout from "@/Layouts/AppLayout";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

interface Client {
    id: number;
    contact_name: string;
    company_name: string | null;
}

interface Props {
    clients: Client[];
}

const DEFAULT_BODY = `<h1>Service Agreement</h1>
<h2>Parties</h2>
<p>This agreement is between the Service Provider and the Client named above.</p>
<h2>Scope of Work</h2>
<p>The Service Provider agrees to deliver the following services:</p>
<ul>
  <li>Describe deliverable 1</li>
  <li>Describe deliverable 2</li>
</ul>
<h2>Compensation</h2>
<p>The Client agrees to pay the agreed amount as per the proposal.</p>
<h2>Terms</h2>
<ol>
  <li>Work begins upon signing of this contract.</li>
  <li>Changes to scope require written agreement.</li>
  <li>Intellectual property transfers to client upon full payment.</li>
  <li>Either party may terminate with 14 days written notice.</li>
  <li>This agreement is governed by German law.</li>
</ol>
<h2>eIDAS Electronic Signature</h2>
<p>By signing below, both parties agree to the terms of this contract. This electronic signature is legally binding under EU eIDAS Regulation.</p>`;

export default function ContractsCreate({ clients }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: "",
        proposal_id: "",
        title: "",
        body: DEFAULT_BODY,
    });

    const editor = useEditor({
        extensions: [StarterKit],
        content: DEFAULT_BODY,
        onUpdate: ({ editor }) => {
            setData("body", editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none focus:outline-none min-h-96 px-6 py-5",
            },
        },
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post("/contracts");
    }

    return (
        <AppLayout title="New Contract">
            <Head title="New Contract" />

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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="e.g. Service Agreement — Vanguard Logistics"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            required
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>
                </div>

                {/* Rich text editor */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 bg-gray-50">
                        <span className="text-xs font-medium text-gray-500 mr-2">
                            Contract Body
                        </span>
                        {[
                            {
                                label: "B",
                                action: () =>
                                    editor?.chain().focus().toggleBold().run(),
                                active: editor?.isActive("bold"),
                            },
                            {
                                label: "I",
                                action: () =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleItalic()
                                        .run(),
                                active: editor?.isActive("italic"),
                            },
                            {
                                label: "H1",
                                action: () =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleHeading({ level: 1 })
                                        .run(),
                                active: editor?.isActive("heading", {
                                    level: 1,
                                }),
                            },
                            {
                                label: "H2",
                                action: () =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleHeading({ level: 2 })
                                        .run(),
                                active: editor?.isActive("heading", {
                                    level: 2,
                                }),
                            },
                            {
                                label: "• List",
                                action: () =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run(),
                                active: editor?.isActive("bulletList"),
                            },
                            {
                                label: "1. List",
                                action: () =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run(),
                                active: editor?.isActive("orderedList"),
                            },
                        ].map(({ label, action, active }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={action}
                                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                                    active
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <EditorContent editor={editor} />

                    {errors.body && (
                        <p className="px-6 pb-3 text-xs text-red-500">
                            {errors.body}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Link
                        href="/contracts"
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {processing ? "Creating…" : "Create Contract"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}
