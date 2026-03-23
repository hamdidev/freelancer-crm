import { Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    Search,
    Bell,
    Settings,
    HelpCircle,
    LogOut,
    User,
    ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { type PageProps } from "@/types";

export default function TopBar() {
    const { auth } = usePage<PageProps>().props;
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const initials = auth.user?.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleLogout() {
        router.post("/logout");
    }

    return (
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-16 bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_4px_24px_rgba(0,56,108,0.04)]">
            {/* Search */}
            <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full w-96">
                <Search size={18} className="text-on-surface-variant" />
                <input
                    className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full text-on-surface placeholder:text-on-surface-variant/70"
                    placeholder="Search leads, proposals, or invoices..."
                    type="text"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-on-surface-variant">
                    <button className="hover:text-primary transition-all">
                        <Bell size={20} />
                    </button>
                    <button className="hover:text-primary transition-all">
                        <Settings size={20} />
                    </button>
                    <button className="hover:text-primary transition-all">
                        <HelpCircle size={20} />
                    </button>
                </div>

                <div className="h-8 w-[1px] bg-outline-variant/30" />

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <div className="text-right">
                            <p className="text-sm font-bold text-on-surface leading-none">
                                {auth.user?.name}
                            </p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter mt-1">
                                {auth.user?.company_name ?? "Freelancer"}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-full border-2 border-primary/10 bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                            {initials}
                        </div>

                        <ChevronDown
                            size={16}
                            className={`text-on-surface-variant transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                    </button>

                    {/* Dropdown */}
                    {open && (
                        <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            {/* User info header */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900">
                                    {auth.user?.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {auth.user?.email}
                                </p>
                            </div>

                            {/* Menu items */}
                            <div className="py-1">
                                <Link
                                    href={route("profile.edit")}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <User size={16} className="text-gray-400" />
                                    Profile & Settings
                                </Link>

                                <Link
                                    href={route("invoices.index")}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Settings
                                        size={16}
                                        className="text-gray-400"
                                    />
                                    Preferences
                                </Link>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-100 pt-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
