import { useEffect } from "react";
import toast from "react-hot-toast";
import { type User } from "@/types";

const toastStyle = {
    background: "#fff",
    color: "#0F172A",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 4px 24px rgba(26,79,139,0.08)",
} as const;

export function useRealtimeNotifications(user: User | null) {
    useEffect(() => {
        if (!user?.id) return;
        if (!window.Echo) return;

        const channel = window.Echo.private(`user.${user.id}`);

        channel.listen(".ProposalViewed", (e: any) => {
            toast(`👁 ${e.client_name} just opened your proposal "${e.proposal_title}"`, {
                icon: "👁️",
                style: { ...toastStyle, background: "#EFF3F8", border: "1px solid #C4D4E3" },
            });
        });

        channel.listen(".ProposalActioned", (e: any) => {
            if (e.action === "accepted") {
                toast.success(`${e.client_name} accepted "${e.proposal_title}"`, {
                    style: toastStyle,
                });
            } else {
                toast.error(`${e.client_name} declined "${e.proposal_title}"`, {
                    style: toastStyle,
                });
            }
        });

        channel.listen(".InvoicePaid", (e: any) => {
            toast.success(
                `💰 ${e.client_name} paid ${e.invoice_number} — €${(e.total_cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 })}`,
                { style: toastStyle, duration: 8000 },
            );
        });

        return () => {
            window.Echo.leave(`user.${user.id}`);
        };
    }, [user?.id]);
}
