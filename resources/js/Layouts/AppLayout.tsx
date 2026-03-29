import { Toaster } from "react-hot-toast";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { type PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import TopBar from "@/Components/TopBar";

export default function AppLayout({ children }: Props) {
    const { auth, flash } = usePage<PageProps>().props;

    // Wire up real-time notifications
    useRealtimeNotifications(auth.user);

    return (
        <div className="min-h-screen bg-surface">
            <Sidebar />

            <div className="ml-64 flex flex-col min-h-screen">
                <TopBar />

                {flash.success && (
                    <div className="mx-8 mt-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm border border-green-200">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="mx-8 mt-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm border border-red-200">
                        {flash.error}
                    </div>
                )}

                <main className="flex-1 px-8 py-6">{children}</main>
            </div>

            {/* Global toast notifications */}
            <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
        </div>
    );
}
