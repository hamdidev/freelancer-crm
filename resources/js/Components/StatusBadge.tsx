// You can define it at the bottom of Portal/Dashboard.tsx
// or extract to resources/js/Components/StatusBadge.tsx

const STATUS_STYLES: Record<string, string> = {
    draft: "bg-surface-container text-on-surface-variant",
    sent: "bg-secondary-container text-on-secondary-container",
    paid: "bg-tertiary-container text-on-tertiary-container",
    overdue: "bg-error-container text-on-error-container",
    cancelled: "bg-surface-container text-on-surface-variant",
    accepted: "bg-tertiary-container text-on-tertiary-container",
    declined: "bg-error-container text-on-error-container",
    pending: "bg-secondary-container text-on-secondary-container",
};

function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`rounded-full px-2.5 py-0.5 text-label-small capitalize
                          ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}
        >
            {status}
        </span>
    );
}
export default StatusBadge;
