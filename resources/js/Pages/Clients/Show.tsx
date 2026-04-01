import { router } from "@inertiajs/react";
import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { route } from "ziggy-js";

function SendPortalLinkButton({ clientId }: { clientId: number }) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        setLoading(true);
        router.post(
            route("portal.send"),
            { client_id: clientId },
            {
                onSuccess: () => setSent(true),
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <button
            onClick={handleSend}
            disabled={loading || sent}
            className="flex items-center gap-2 rounded-full bg-secondary-container
                 text-on-secondary-container px-5 py-2.5 text-label-large
                 hover:bg-secondary/20 disabled:opacity-50 transition-colors"
        >
            {loading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <ExternalLink size={16} />
            )}
            {sent ? "Link Sent ✓" : "Send Portal Link"}
        </button>
    );
}
