import { type ReactNode } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import TopBar from "@/Components/TopBar";
import { type PageProps } from "@/types";

interface Props {
    children: ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: Props) {
    const { flash } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <div className="ml-64 flex flex-col min-h-screen">
                <TopBar />

                {/* Flash messages */}
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

                {/* Page content */}
                <main className="flex-1 px-8 py-6">{children}</main>
            </div>
        </div>
    );
}
