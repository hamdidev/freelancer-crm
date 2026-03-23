import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AppLayout from "@/Layouts/AppLayout";
import {
    type Lead,
    type LeadStatus,
    LEAD_STATUS_LABELS,
    LEAD_STATUS_COLORS,
} from "@/types";
import LeadCard from "./LeadCard";
import LeadColumn from "./LeadColumn";
import CreateLeadModal from "./CreateLeadModal";

interface Props {
    leadsByStatus: Record<string, Lead[]>;
    statuses: LeadStatus[];
}

const PIPELINE_COLUMNS: LeadStatus[] = [
    "new",
    "contacted",
    "proposal_sent",
    "negotiation",
];

export default function LeadsIndex({ leadsByStatus, statuses }: Props) {
    const [activeCard, setActiveCard] = useState<Lead | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );

    function handleDragStart(event: DragStartEvent) {
        const lead = Object.values(leadsByStatus)
            .flat()
            .find((l) => l.id === event.active.id);
        setActiveCard(lead ?? null);
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveCard(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        // over.id is either a column status string or another card id
        const newStatus = PIPELINE_COLUMNS.includes(over.id as LeadStatus)
            ? (over.id as LeadStatus)
            : (Object.entries(leadsByStatus).find(([, leads]) =>
                  leads.some((l) => l.id === over.id),
              )?.[0] as LeadStatus | undefined);

        if (!newStatus) return;

        router.patch(
            `/leads/${active.id}/status`,
            { status: newStatus },
            { preserveScroll: true },
        );
    }

    const wonLeads = leadsByStatus["won"] ?? [];
    const lostLeads = leadsByStatus["lost"] ?? [];

    return (
        <AppLayout title="Leads">
            <Head title="Leads" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm text-gray-500">
                        {Object.values(leadsByStatus).flat().length} total leads
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + New Lead
                </button>
            </div>

            {/* Kanban board */}
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {PIPELINE_COLUMNS.map((status) => (
                        <LeadColumn
                            key={status}
                            status={status}
                            leads={leadsByStatus[status] ?? []}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeCard && <LeadCard lead={activeCard} isDragging />}
                </DragOverlay>
            </DndContext>

            {/* Won / Lost summary rows */}
            <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                    {
                        label: "Won",
                        leads: wonLeads,
                        color: "border-green-200 bg-green-50",
                    },
                    {
                        label: "Lost",
                        leads: lostLeads,
                        color: "border-red-200 bg-red-50",
                    },
                ].map(({ label, leads, color }) => (
                    <div
                        key={label}
                        className={`rounded-xl border p-4 ${color}`}
                    >
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            {label} ({leads.length})
                        </h3>
                        <div className="space-y-2">
                            {leads.length === 0 && (
                                <p className="text-xs text-gray-400">
                                    None yet
                                </p>
                            )}
                            {leads.map((lead) => (
                                <div
                                    key={lead.id}
                                    className="flex justify-between text-sm"
                                >
                                    <span className="text-gray-700">
                                        {lead.title}
                                    </span>
                                    <span className="text-gray-500">
                                        €
                                        {(
                                            lead.value_estimate / 100
                                        ).toLocaleString("de-DE")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create modal */}
            {showCreate && (
                <CreateLeadModal onClose={() => setShowCreate(false)} />
            )}
        </AppLayout>
    );
}
