import { usePage } from "@inertiajs/react";
import { type ReactNode } from "react";
import { type PageProps } from "@/types";

interface Props {
    children: ReactNode;
    title?: string;
}

export default function PortalLayout({ children, title }: Props) {
    const { auth } = usePage<PageProps>().props;
    const brandColor = auth.user?.brand_color ?? "#6366f1";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Branded header */}
            <header
                className="h-16 flex items-center px-8 shadow-sm"
                style={{ backgroundColor: brandColor }}
            >
                <span className="text-white font-semibold text-lg">
                    {auth.user?.company_name ??
                        auth.user?.name ??
                        "Client Portal"}
                </span>
                <span className="ml-auto text-white/70 text-sm">
                    {auth.client?.display_name}
                </span>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {title && (
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        {title}
                    </h1>
                )}
                {children}
            </main>
        </div>
    );
}
