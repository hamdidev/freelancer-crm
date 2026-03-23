import { Link, usePage } from "@inertiajs/react";
import { type ReactNode } from "react";
import { type PageProps } from "@/types";

interface Props {
    children: ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: Props) {
    const { auth, flash } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <span className="text-xl font-bold text-indigo-600">
                        FreelancerCRM
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {[
                        { href: "/dashboard", label: "Dashboard" },
                        { href: "/leads", label: "Leads" },
                        { href: "/proposals", label: "Proposals" },
                        { href: "/contracts", label: "Contracts" },
                        { href: "/invoices", label: "Invoices" },
                        { href: "/time", label: "Time" },
                        { href: "/clients", label: "Clients" },
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* User footer */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600">
                            {auth.user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {auth.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {auth.user?.email}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="mt-3 w-full text-left text-xs text-gray-500 hover:text-red-500 transition-colors"
                    >
                        Sign out
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
                    {title && (
                        <h1 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h1>
                    )}
                </header>

                {/* Flash messages */}
                {flash.success && (
                    <div className="mx-8 mt-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="mx-8 mt-4 p-3 rounded-lg bg-red-50 text-red-800 text-sm">
                        {flash.error}
                    </div>
                )}

                {/* Page content */}
                <main className="flex-1 px-8 py-6">{children}</main>
            </div>
        </div>
    );
}
