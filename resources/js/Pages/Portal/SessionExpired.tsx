import { Link } from "@inertiajs/react";
import { ShieldOff } from "lucide-react";

export default function SessionExpired() {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <div className="text-center max-w-sm">
                <ShieldOff
                    size={48}
                    className="text-on-surface-variant mx-auto mb-4"
                />
                <h1 className="text-headline-small text-on-surface mb-2">
                    Session Expired
                </h1>
                <p className="text-body-medium text-on-surface-variant mb-6">
                    Your portal link has expired or already been used. Ask your
                    freelancer to send you a new one.
                </p>
            </div>
        </div>
    );
}
