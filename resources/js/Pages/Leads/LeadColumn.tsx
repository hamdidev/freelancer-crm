import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type Lead, type LeadStatus, LEAD_STATUS_LABELS } from "@/types";
import LeadCard from "./LeadCard";

const COLUMN_COLORS: Record<LeadStatus, string> = {
    new: "border-blue-200",
    contacted: "border-violet-200",
    proposal_sent: "border-amber-200",
    negotiation: "border-orange-200",
    won: "border-green-200",
    lost: "border-red-200",
};

interface Props {
    status: LeadStatus;
    leads: Lead[];
}

export default function LeadColumn({ status, leads }: Props) {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    const totalValue = leads.reduce((sum, l) => sum + l.value_estimate, 0);

    return (
        <div className="flex-shrink-0 w-72">
            {/* Column header */}
            <div
                className={`border-t-2 ${COLUMN_COLORS[status]} bg-white rounded-xl shadow-sm`}
            >
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                        {LEAD_STATUS_LABELS[status]}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                            €{(totalValue / 100).toLocaleString("de-DE")}
                        </span>
                        <span className="w-5 h-5 bg-gray-100 rounded-full text-xs flex items-center justify-center text-gray-500 font-medium">
                            {leads.length}
                        </span>
                    </div>
                </div>

                {/* Cards drop zone */}
                <div
                    ref={setNodeRef}
                    className={`p-3 min-h-48 space-y-2 rounded-b-xl transition-colors ${
                        isOver ? "bg-indigo-50" : "bg-gray-50"
                    }`}
                >
                    <SortableContext
                        items={leads.map((l) => l.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {leads.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} />
                        ))}
                    </SortableContext>

                    {leads.length === 0 && (
                        <p className="text-xs text-gray-400 text-center pt-6">
                            Drop leads here
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
