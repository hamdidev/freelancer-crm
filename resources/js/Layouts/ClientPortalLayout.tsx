// resources/js/Layouts/ClientPortalLayout.tsx

import { Toaster } from "react-hot-toast";
import { usePage, Link } from "@inertiajs/react";
import {
    LogOut,
    LayoutDashboard,
    FileText,
    Receipt,
    PenLine,
} from "lucide-react";
import { route } from "ziggy-js";

interface ClientPageProps {
    auth: {
        client: {
            name: string;
            email: string;
        } | null;
    };
    flash: {
        success?: string;
        error?: string;
    };
}

interface Props {
    children: React.ReactNode;
    title?: string;
}

const navItems = [
    { href: "portal.dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "portal.proposals.index", label: "Proposals", icon: FileText },
    { href: "portal.invoices.index", label: "Invoices", icon: Receipt },
    { href: "portal.contracts.index", label: "Contracts", icon: PenLine },
];

export default function ClientPortalLayout({ children, title }: Props) {
    const { auth, flash } = usePage<ClientPageProps>().props;
    const client = auth.client;

    return (
        <div className="min-h-screen bg-surface">
            {/* Sidebar */}
            <aside
                className="fixed inset-y-0 left-0 w-64 bg-surface-container-low
                              border-r border-outline-variant flex flex-col"
            >
                {/* Brand */}
                <div className="px-6 py-5 border-b border-outline-variant">
                    <p className="text-title-medium text-on-surface">
                        Client Portal
                    </p>
                    <p className="text-body-small text-on-surface-variant truncate mt-0.5">
                        {client?.email}
                    </p>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={route(href)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                                       text-body-medium text-on-surface-variant
                                       hover:bg-surface-container hover:text-on-surface
                                       transition-colors"
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Footer — client name + logout */}
                <div className="px-4 py-4 border-t border-outline-variant">
                    <p className="text-body-small text-on-surface-variant px-3 mb-2 truncate">
                        {client?.name}
                    </p>
                    <Link
                        href={route("portal.logout")}
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg
                                   text-body-medium text-on-surface-variant
                                   hover:bg-error-container hover:text-on-error-container
                                   transition-colors"
                    >
                        <LogOut size={18} />
                        Sign out
                    </Link>
                </div>
            </aside>

            {/* Main content — mirrors your ml-64 pattern */}
            <div className="ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <header
                    className="sticky top-0 z-10 bg-surface border-b
                                   border-outline-variant px-8 py-4"
                >
                    <p className="text-title-medium text-on-surface">
                        {title ?? "Client Portal"}
                    </p>
                </header>

                {/* Flash messages — identical to AppLayout */}
                {flash?.success && (
                    <div
                        className="mx-8 mt-4 p-3 rounded-lg bg-green-50 text-green-800
                                    text-sm border border-green-200"
                    >
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div
                        className="mx-8 mt-4 p-3 rounded-lg bg-red-50 text-red-800
                                    text-sm border border-red-200"
                    >
                        {flash.error}
                    </div>
                )}

                <main className="flex-1 px-8 py-6">{children}</main>
            </div>

            <Toaster
                position="bottom-right"
                toastOptions={{ duration: 5000 }}
            />
        </div>
    );
}
