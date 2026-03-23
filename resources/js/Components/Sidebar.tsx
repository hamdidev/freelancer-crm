import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    UserSearch,
    FileText,
    Receipt,
    FolderKanban,
    Clock,
    Users,
} from "lucide-react";
import { type PageProps } from "@/types";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/leads", label: "Leads", icon: UserSearch },
    { href: "/proposals", label: "Proposals", icon: FileText },
    { href: "/contracts", label: "Contracts", icon: FolderKanban },
    { href: "/invoices", label: "Invoices", icon: Receipt },
    { href: "/time", label: "Time", icon: Clock },
    { href: "/clients", label: "Clients", icon: Users },
];

export default function Sidebar() {
    const { url, props } = usePage<PageProps>();
    const { auth } = props;

    const initials = auth.user?.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <aside className="fixed left-0 top-0 h-full flex flex-col py-6 bg-surface-container-lowest w-64 z-50">
            {/* Logo */}
            <div className="px-6 mb-10">
                <h1 className="text-xl font-bold text-primary tracking-tight">
                    FreelancerCRM
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">
                    Executive Suite
                </p>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive =
                        url.startsWith(href) &&
                        (href !== "/dashboard" || url === "/dashboard");

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-3 ml-2 rounded-l-lg transition-colors ${
                                isActive
                                    ? "text-primary font-bold bg-surface shadow-sm"
                                    : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                            }`}
                        >
                            <Icon size={20} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User profile */}
            <div className="px-4 mt-auto">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">
                            {auth.user?.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                            {auth.user?.email}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
