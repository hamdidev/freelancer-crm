import { router } from "@inertiajs/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { type Lead, LEAD_STATUS_COLORS } from "@/types";

interface Props {
    lead: Lead;
    isDragging?: boolean;
}

export default function LeadCard({ lead, isDragging = false }: Props) {
    const [showMenu, setShowMenu] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.4 : 1,
    };

    function handleDelete() {
        if (!confirm("Delete this lead?")) return;
        router.delete(`/leads/${lead.id}`, { preserveScroll: true });
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white rounded-lg border border-gray-200 p-3 cursor-grab shadow-sm hover:shadow-md transition-shadow select-none ${
                isDragging ? "shadow-lg rotate-1 cursor-grabbing" : ""
            }`}
        >
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                    {lead.title}
                </p>

                {/* Context menu */}
                <div className="relative flex-shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
                        onPointerDown={(e) => e.stopPropagation()} // prevent drag on menu click
                    >
                        ···
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 w-32">
                            <button
                                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Client name */}
            {lead.client && (
                <p className="text-xs text-gray-500 mt-1">
                    {lead.client.company_name ?? lead.client.contact_name}
                </p>
            )}

            {/* Source tag + value */}
            <div className="flex items-center justify-between mt-2">
                {lead.source && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {lead.source}
                    </span>
                )}
                {lead.value_estimate > 0 && (
                    <span className="text-xs font-semibold text-gray-700 ml-auto">
                        €{(lead.value_estimate / 100).toLocaleString("de-DE")}
                    </span>
                )}
            </div>
        </div>
    );
}
