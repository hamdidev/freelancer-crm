import { Link, usePage, router } from "@inertiajs/react";
import {
    Search,
    Bell,
    Settings,
    HelpCircle,
    LogOut,
    ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { type PageProps } from "@/types";

interface SearchResult {
    type: string;
    id: number;
    title: string;
    subtitle: string;
    url: string;
    color: string;
}

const TYPE_COLORS: Record<string, string> = {
    lead: "bg-blue-100 text-blue-700",
    proposal: "bg-violet-100 text-violet-700",
    invoice: "bg-green-100 text-green-700",
    client: "bg-amber-100 text-amber-700",
    contract: "bg-orange-100 text-orange-700",
};

export default function TopBar() {
    const { auth } = usePage<PageProps>().props;
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const initials = auth.user?.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target as Node)
            ) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search
    function handleSearch(value: string) {
        setQuery(value);
        setShowResults(true);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!value.trim() || value.length < 2) {
            setResults([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await fetch(
                    `/search?q=${encodeURIComponent(value)}`,
                    {
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                            Accept: "application/json",
                        },
                    },
                );
                const data = await res.json();
                setResults(data.results ?? []);
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 300);
    }

    function handleResultClick(url: string) {
        setQuery("");
        setResults([]);
        setShowResults(false);
        router.visit(url);
    }

    function handleLogout() {
        router.post("/logout");
    }

    return (
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-16 bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_4px_24px_rgba(0,56,108,0.04)]">
            {/* Search */}
            <div ref={searchRef} className="relative w-96">
                <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full">
                    <Search
                        size={18}
                        className="text-on-surface-variant flex-shrink-0"
                    />
                    <input
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => setShowResults(true)}
                        className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full text-on-surface placeholder:text-on-surface-variant/70"
                        placeholder="Search leads, proposals, invoices..."
                        type="text"
                    />
                    {searching && (
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin flex-shrink-0" />
                    )}
                </div>

                {/* Search results dropdown */}
                {showResults && query.length >= 2 && (
                    <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-80 overflow-y-auto">
                        {results.length === 0 && !searching && (
                            <p className="px-4 py-3 text-sm text-gray-400 text-center">
                                No results for "{query}"
                            </p>
                        )}

                        {results.map((result, i) => (
                            <button
                                key={`${result.type}-${result.id}`}
                                onClick={() => handleResultClick(result.url)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                            >
                                <span
                                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[result.type] ?? "bg-gray-100 text-gray-600"}`}
                                >
                                    {result.type}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {result.title}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {result.subtitle}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
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

                    {open && (
                        <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900">
                                    {auth.user?.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {auth.user?.email}
                                </p>
                            </div>
                            <div className="py-1">
                                <Link
                                    href="/settings"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Settings
                                        size={16}
                                        className="text-gray-400"
                                    />
                                    Profile & Settings
                                </Link>
                            </div>
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
