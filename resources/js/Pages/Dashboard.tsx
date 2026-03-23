import { Head } from "@inertiajs/react";
import {
    TrendingUp,
    Wallet,
    LineChart,
    FileText,
    Banknote,
    User,
} from "lucide-react";
import AppLayout from "@/Layouts/AppLayout";

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <main className="min-h-screen">
                {/* Hero Section */}
                <section className="mb-12">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-2 block">
                                Enterprise Overview
                            </span>
                            <h2 className="text-4xl font-extrabold text-primary tracking-tight">
                                Financial Health
                            </h2>
                        </div>
                        <div className="flex gap-2 bg-surface-container rounded-lg p-1">
                            <button className="px-4 py-1.5 text-xs font-bold bg-white text-primary rounded shadow-sm">
                                Annual
                            </button>
                            <button className="px-4 py-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                                Quarterly
                            </button>
                            <button className="px-4 py-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                                Monthly
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        {/* Large Revenue Metric */}
                        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_30px_rgb(0,56,108,0.04)] relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-on-surface-variant font-medium mb-1">
                                    Total Revenue Growth
                                </p>
                                <div className="flex items-baseline gap-4">
                                    <h3 className="text-6xl font-extrabold text-primary tracking-tighter">
                                        $142,850.00
                                    </h3>
                                    <span className="flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                        <TrendingUp
                                            size={14}
                                            className="mr-1"
                                        />
                                        24.5%
                                    </span>
                                </div>
                                <div className="mt-12 h-48 w-full flex items-end gap-3">
                                    {[
                                        40, 35, 55, 50, 65, 75, 68, 85, 80, 100,
                                    ].map((h, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-t-sm ${
                                                i === 9
                                                    ? "bg-gradient-to-t from-primary to-primary-container"
                                                    : `bg-primary/${10 + i * 5}`
                                            }`}
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                        </div>

                        {/* Summary Cards */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden">
                                <p className="text-primary-fixed/70 text-sm font-medium mb-1">
                                    Projected Earnings (Q4)
                                </p>
                                <h4 className="text-3xl font-bold mb-4">
                                    $38,200
                                </h4>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-white h-full w-[72%]" />
                                </div>
                                <p className="text-[11px] mt-3 opacity-80 uppercase tracking-wider font-bold">
                                    72% of Quarterly Goal Reached
                                </p>
                                <Wallet
                                    className="absolute top-4 right-4 opacity-20"
                                    size={48}
                                />
                            </div>

                            <div className="bg-surface-container-low p-6 rounded-xl shadow-sm relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                <div className="flex justify-between items-start mb-4 pl-2">
                                    <div>
                                        <p className="text-on-surface-variant text-sm font-medium">
                                            Average Project Value
                                        </p>
                                        <h4 className="text-2xl font-bold text-on-surface">
                                            $4,850
                                        </h4>
                                    </div>
                                    <span className="bg-primary/10 p-2 rounded-lg text-primary">
                                        <LineChart size={20} />
                                    </span>
                                </div>
                                <p className="text-xs text-on-surface-variant pl-2">
                                    <span className="text-emerald-600 font-bold">
                                        +12%
                                    </span>{" "}
                                    vs last month
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Secondary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Active Leads */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                Active Leads
                                <span className="bg-secondary-container text-on-secondary-fixed-variant text-[10px] px-2 py-0.5 rounded-full">
                                    12 NEW
                                </span>
                            </h3>
                            <button className="text-xs font-bold text-primary hover:underline">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                {
                                    name: "Vanguard Logistics",
                                    desc: "Re-branding and Digital Strategy",
                                    badge: "High Intent",
                                    time: "2h ago",
                                },
                                {
                                    name: "Aether Systems",
                                    desc: "SaaS Platform Design Audit",
                                    badge: "Discovery",
                                    time: "1d ago",
                                },
                            ].map(({ name, desc, badge, time }) => (
                                <div
                                    key={name}
                                    className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-bold text-sm">
                                            {name}
                                        </h5>
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary-container text-on-secondary-fixed-variant px-2 py-0.5 rounded">
                                            {badge}
                                        </span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant mb-3">
                                        {desc}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                            {name[0]}
                                        </div>
                                        <span className="text-[10px] text-on-surface-variant font-medium">
                                            Updated {time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Pending Proposals */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                Pending Proposals
                                <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] px-2 py-0.5 rounded-full">
                                    5 SENT
                                </span>
                            </h3>
                            <button className="text-xs font-bold text-primary hover:underline">
                                Manage
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                {
                                    title: "Fintech Core Web App",
                                    client: "Marcus Thorne",
                                    date: "Oct 24",
                                    amount: "$12,500",
                                    progress: "66%",
                                    label: "Reviewing",
                                },
                                {
                                    title: "Omni Brand Identity",
                                    client: "Sarah Jenkins",
                                    date: "Oct 22",
                                    amount: "$6,200",
                                    progress: "100%",
                                    label: "Signature Pending",
                                },
                            ].map(
                                ({
                                    title,
                                    client,
                                    date,
                                    amount,
                                    progress,
                                    label,
                                }) => (
                                    <div
                                        key={title}
                                        className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <h5 className="font-bold text-sm">
                                                {title}
                                            </h5>
                                            <span className="text-sm font-extrabold text-primary">
                                                {amount}
                                            </span>
                                        </div>
                                        <p className="text-xs text-on-surface-variant mb-4">
                                            Sent to {client} • {date}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-surface-container rounded-full">
                                                <div
                                                    className="bg-primary h-full rounded-full"
                                                    style={{ width: progress }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-on-surface-variant">
                                                {label}
                                            </span>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </section>

                    {/* Upcoming Payments */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                Upcoming Payments
                                <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] px-2 py-0.5 rounded-full">
                                    3 DUE
                                </span>
                            </h3>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col gap-1 p-1">
                            {[
                                {
                                    date: "OCT 28",
                                    client: "Lumina Systems",
                                    desc: "Milestone 2",
                                    amount: "$4,200",
                                    color: "bg-emerald-50 text-emerald-700",
                                },
                                {
                                    date: "OCT 30",
                                    client: "Horizon Lab",
                                    desc: "Final Wrap",
                                    amount: "$1,850",
                                    color: "bg-amber-50 text-amber-700",
                                },
                                {
                                    date: "NOV 02",
                                    client: "Nexus Corp",
                                    desc: "Monthly Retainer",
                                    amount: "$2,500",
                                    color: "bg-primary/5 text-primary",
                                },
                            ].map(({ date, client, desc, amount, color }) => (
                                <div
                                    key={client}
                                    className="p-3 rounded-lg flex items-center justify-between hover:bg-surface-container-low transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${color}`}
                                        >
                                            {date}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">
                                                {client}
                                            </p>
                                            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">
                                                {desc}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-extrabold text-on-surface">
                                        {amount}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className="mt-2 w-full py-3 border-2 border-dashed border-outline-variant/50 rounded-xl text-on-surface-variant text-xs font-bold hover:border-primary/50 hover:text-primary transition-all">
                            + Request Deposit
                        </button>
                    </section>
                </div>

                {/* Activity Stream */}
                <section className="mt-12 bg-surface-container-lowest rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,56,108,0.03)]">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-extrabold tracking-tight">
                                Recent Activity Stream
                            </h3>
                            <p className="text-sm text-on-surface-variant">
                                Live updates across your portfolio
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                                Live System Status
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {/* Header */}
                        <div className="grid grid-cols-12 px-4 py-3 bg-surface-container-low rounded-lg mb-2">
                            {[
                                "Client / Entity",
                                "Status",
                                "Date",
                                "Amount",
                            ].map((h, i) => (
                                <div
                                    key={h}
                                    className={`text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider ${
                                        i === 0
                                            ? "col-span-5"
                                            : i === 1
                                              ? "col-span-3"
                                              : i === 2
                                                ? "col-span-2"
                                                : "col-span-2 text-right"
                                    }`}
                                >
                                    {h}
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        {[
                            {
                                icon: <FileText size={16} />,
                                title: "Stratos Ledger Proposal",
                                sub: "Proposal #4928-1",
                                badge: "Awaiting Approval",
                                badgeClass:
                                    "bg-tertiary-fixed text-on-tertiary-fixed-variant",
                                date: "Oct 26, 2023",
                                amount: "$14,200.00",
                                amountClass: "text-on-surface",
                            },
                            {
                                icon: <Banknote size={16} />,
                                title: "Vertex Creative Payment",
                                sub: "Invoice #2023-88",
                                badge: "Payment Received",
                                badgeClass:
                                    "bg-surface-container-highest text-on-surface",
                                date: "Oct 25, 2023",
                                amount: "$5,500.00",
                                amountClass: "text-emerald-600",
                            },
                            {
                                icon: <User size={16} />,
                                title: "New Lead: SolarOne Energy",
                                sub: "Inbound Inquiry",
                                badge: "New Lead",
                                badgeClass:
                                    "bg-secondary-container text-on-secondary-fixed-variant",
                                date: "Oct 25, 2023",
                                amount: "---",
                                amountClass: "text-on-surface-variant",
                            },
                        ].map(
                            ({
                                icon,
                                title,
                                sub,
                                badge,
                                badgeClass,
                                date,
                                amount,
                                amountClass,
                            }) => (
                                <div
                                    key={title}
                                    className="grid grid-cols-12 px-4 py-4 hover:bg-surface-container-low transition-all items-center cursor-pointer rounded-lg"
                                >
                                    <div className="col-span-5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                            {icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">
                                                {title}
                                            </p>
                                            <p className="text-[10px] text-on-surface-variant">
                                                {sub}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <span
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${badgeClass}`}
                                        >
                                            {badge}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-sm text-on-surface-variant font-medium">
                                        {date}
                                    </div>
                                    <div
                                        className={`col-span-2 text-right text-sm font-extrabold ${amountClass}`}
                                    >
                                        {amount}
                                    </div>
                                </div>
                            ),
                        )}
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button className="text-xs font-bold text-primary px-6 py-2 rounded-full border border-primary/20 hover:bg-primary hover:text-white transition-all">
                            Load Earlier Activity
                        </button>
                    </div>
                </section>
            </main>
        </AppLayout>
    );
}
