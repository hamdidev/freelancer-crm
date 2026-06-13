import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import type { PageProps } from "@/types";

type IconProps = { className?: string };

/* ── Inline SVG icons (Heroicons outline, no emoji) ─────────────── */

function ClientsIcon({ className }: IconProps) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
    );
}

function PipelineIcon({ className }: IconProps) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6Z" />
        </svg>
    );
}

function ProposalIcon({ className }: IconProps) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
        </svg>
    );
}

function InvoiceIcon({ className }: IconProps) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
    );
}

function ContractIcon({ className }: IconProps) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
    );
}

function TimeIcon({ className }: IconProps) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    );
}

function CheckIcon({ className }: IconProps) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );
}

function ArrowIcon({ className }: IconProps) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    );
}

/* ── Feature data ───────────────────────────────────────────────── */

const features = [
    {
        icon: ClientsIcon,
        title: "Client Management",
        body: "Keep every client, contact, and detail in one organized place — from first hello to final invoice.",
    },
    {
        icon: PipelineIcon,
        title: "Lead Pipeline",
        body: "Track deals across a visual Kanban board. Move leads from new to won without losing momentum.",
    },
    {
        icon: ProposalIcon,
        title: "Proposals",
        body: "Send polished proposals clients can review and accept online. No PDFs lost in email threads.",
    },
    {
        icon: InvoiceIcon,
        title: "Invoices & Payments",
        body: "Create invoices, accept card payments via Stripe, and let overdue reminders run themselves.",
    },
    {
        icon: ContractIcon,
        title: "Contracts & e‑Signatures",
        body: "Draft contracts and collect legally binding signatures on a secure public signing page.",
    },
    {
        icon: TimeIcon,
        title: "Time Tracking",
        body: "Start a timer, log billable hours, and sync them straight onto an invoice in one click.",
    },
];

const benefits = [
    "Self-serve client portal with magic-link access",
    "Real-time dashboard with revenue at a glance",
    "Full-text search across everything you own",
    "Recurring invoices and automatic overdue tracking",
];

/* ── Page ───────────────────────────────────────────────────────── */

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const primaryHref = auth.user ? "/dashboard" : "/register";
    const primaryLabel = auth.user ? "Go to dashboard" : "Start free";

    return (
        <>
            <Head title="FreelancerDash — Run your freelance business in one place">
                <meta
                    name="description"
                    content="FreelancerDash helps independent professionals manage clients, leads, proposals, invoices, contracts, and time tracking — from first lead to paid invoice."
                />
            </Head>

            <div className="min-h-dvh bg-surface text-on-surface antialiased">
                {/* Skip link for keyboard users */}
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-card focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
                >
                    Skip to content
                </a>

                {/* ── Nav ──────────────────────────────────────────── */}
                <header className="sticky top-0 z-40 border-b border-outline-variant/60 bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
                    <nav
                        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8"
                        aria-label="Primary"
                    >
                        <Link href="/" className="flex items-center gap-2.5 rounded-chip focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                            <span className="grid h-9 w-9 place-items-center rounded-chip bg-primary text-on-primary font-bold">
                                F
                            </span>
                            <span className="text-lg font-bold tracking-tight">
                                FreelancerDash
                            </span>
                        </Link>

                        <div className="hidden items-center gap-8 md:flex">
                            <a href="#features" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
                                Features
                            </a>
                            <a href="#how" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
                                How it works
                            </a>
                            <a href="#testimonial" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
                                Customers
                            </a>
                        </div>

                        <div className="hidden items-center gap-3 md:flex">
                            {auth.user ? (
                                <Link href="/dashboard" className="btn-primary text-sm">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="rounded-card px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    >
                                        Sign in
                                    </Link>
                                    <Link href="/register" className="btn-primary text-sm">
                                        Start free
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile toggle */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen((v) => !v)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-card text-on-surface-variant transition-colors hover:bg-surface-container md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-menu"
                            aria-label="Toggle navigation menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                                )}
                            </svg>
                        </button>
                    </nav>

                    {mobileOpen && (
                        <div id="mobile-menu" className="border-t border-outline-variant/60 px-4 py-4 md:hidden">
                            <div className="flex flex-col gap-1">
                                <a href="#features" onClick={() => setMobileOpen(false)} className="rounded-card px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container">
                                    Features
                                </a>
                                <a href="#how" onClick={() => setMobileOpen(false)} className="rounded-card px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container">
                                    How it works
                                </a>
                                <a href="#testimonial" onClick={() => setMobileOpen(false)} className="rounded-card px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container">
                                    Customers
                                </a>
                                <div className="mt-3 flex flex-col gap-2">
                                    {auth.user ? (
                                        <Link href="/dashboard" className="btn-primary text-center text-sm">
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/login" className="btn-outlined text-center text-sm">
                                                Sign in
                                            </Link>
                                            <Link href="/register" className="btn-primary text-center text-sm">
                                                Start free
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <main id="main">
                    {/* ── Hero ─────────────────────────────────────── */}
                    <section className="relative overflow-hidden">
                        <div
                            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_50%_-10%,var(--color-primary-container),transparent)] opacity-60"
                            aria-hidden="true"
                        />
                        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-28">
                            <div className="mx-auto max-w-3xl text-center">
                                <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-3 py-1 text-xs font-semibold text-on-surface-variant">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Built for independent professionals
                                </span>

                                <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                    Run your freelance business in{" "}
                                    <span className="text-primary">one place</span>
                                </h1>

                                <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-on-surface-variant">
                                    Clients, leads, proposals, invoices, contracts,
                                    and time tracking — every part of your client
                                    lifecycle, from first lead to paid invoice,
                                    without juggling five different tools.
                                </p>

                                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                    <Link
                                        href={primaryHref}
                                        className="btn-primary group inline-flex items-center gap-2 px-6 py-3 text-base shadow-primary"
                                    >
                                        {primaryLabel}
                                        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                                    </Link>
                                    <a
                                        href="#features"
                                        className="btn-outlined px-6 py-3 text-base"
                                    >
                                        See features
                                    </a>
                                </div>

                                <p className="mt-4 text-sm text-on-surface-variant">
                                    No credit card required · Free to get started
                                </p>
                            </div>

                            {/* Stat strip */}
                            <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-card border border-outline-variant bg-outline-variant/60 sm:grid-cols-4">
                                {[
                                    { value: "6-in-1", label: "Tools replaced" },
                                    { value: "100%", label: "Self-hosted data" },
                                    { value: "Stripe", label: "Payments built in" },
                                    { value: "Instant", label: "Client portal" },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-surface-container-lowest px-4 py-5 text-center">
                                        <dt className="text-2xl font-bold tracking-tight text-on-surface">
                                            {stat.value}
                                        </dt>
                                        <dd className="mt-1 text-xs font-medium text-on-surface-variant">
                                            {stat.label}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </section>

                    {/* ── Features ─────────────────────────────────── */}
                    <section id="features" className="scroll-mt-20 border-t border-outline-variant/60 py-20 sm:py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    Everything you need to get paid
                                </h2>
                                <p className="mt-4 text-lg text-on-surface-variant">
                                    One connected workspace for the entire client
                                    lifecycle — no more copy-pasting between apps.
                                </p>
                            </div>

                            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {features.map(({ icon: Icon, title, body }) => (
                                    <div
                                        key={title}
                                        className="card group border border-outline-variant shadow-surface transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated motion-reduce:transform-none motion-reduce:transition-none"
                                    >
                                        <div className="grid h-12 w-12 place-items-center rounded-card bg-primary-container text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary motion-reduce:transition-none">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-5 text-lg font-semibold">
                                            {title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                                            {body}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── How it works / benefits ──────────────────── */}
                    <section id="how" className="scroll-mt-20 border-t border-outline-variant/60 bg-surface-container-low py-20 sm:py-24">
                        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    From first lead to paid invoice
                                </h2>
                                <p className="mt-4 text-lg text-on-surface-variant">
                                    FreelancerDash connects every step so nothing
                                    slips through the cracks. Win the lead, send the
                                    proposal, sign the contract, track your hours,
                                    and collect payment — all in one flow.
                                </p>

                                <ul className="mt-8 space-y-4">
                                    {benefits.map((benefit) => (
                                        <li key={benefit} className="flex items-start gap-3">
                                            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                                                <CheckIcon className="h-3.5 w-3.5" />
                                            </span>
                                            <span className="text-sm leading-relaxed text-on-surface">
                                                {benefit}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={primaryHref}
                                    className="btn-primary mt-9 inline-flex items-center gap-2 px-6 py-3 text-base"
                                >
                                    {primaryLabel}
                                    <ArrowIcon className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Visual: stylized pipeline mock */}
                            <div className="relative">
                                <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-5 shadow-elevated">
                                    <div className="flex items-center justify-between border-b border-outline-variant/70 pb-3">
                                        <span className="text-sm font-semibold">Pipeline</span>
                                        <span className="rounded-chip bg-primary-container px-2 py-0.5 text-xs font-semibold text-primary">
                                            4 active
                                        </span>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        {[
                                            { name: "Acme Co. — Website redesign", stage: "Proposal", tone: "bg-amber-100 text-amber-700" },
                                            { name: "Lumen Studio — Brand kit", stage: "Won", tone: "bg-emerald-100 text-emerald-700" },
                                            { name: "Northwind — Retainer", stage: "Qualified", tone: "bg-sky-100 text-sky-700" },
                                        ].map((row) => (
                                            <div key={row.name} className="flex items-center justify-between rounded-card border border-outline-variant/70 bg-surface px-3 py-3">
                                                <span className="truncate pr-3 text-sm font-medium">
                                                    {row.name}
                                                </span>
                                                <span className={`shrink-0 rounded-chip px-2 py-0.5 text-xs font-semibold ${row.tone}`}>
                                                    {row.stage}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center justify-between rounded-card bg-primary px-4 py-3 text-on-primary">
                                        <span className="text-sm font-medium">Invoice #1042 paid</span>
                                        <span className="text-sm font-bold">€3,200.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Social proof ─────────────────────────────── */}
                    <section id="testimonial" className="scroll-mt-20 border-t border-outline-variant/60 py-20 sm:py-24">
                        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                            <svg className="mx-auto h-9 w-9 text-primary/30" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                            </svg>
                            <blockquote className="mt-6 text-balance text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                                “I closed my laptop on five subscriptions the week I
                                switched. Proposals, contracts, and invoices finally
                                live in the same place my clients do.”
                            </blockquote>
                            <figcaption className="mt-8 flex items-center justify-center gap-3">
                                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-container font-semibold text-primary">
                                    MR
                                </span>
                                <div className="text-left">
                                    <div className="text-sm font-semibold">Maria Reyes</div>
                                    <div className="text-sm text-on-surface-variant">
                                        Independent Brand Designer
                                    </div>
                                </div>
                            </figcaption>
                        </div>
                    </section>

                    {/* ── Final CTA ────────────────────────────────── */}
                    <section className="px-4 pb-20 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center text-on-primary sm:px-12">
                            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                                Stop juggling tools. Start getting paid.
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-on-primary/80">
                                Set up your workspace in minutes and run your whole
                                freelance business from a single dashboard.
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link
                                    href={primaryHref}
                                    className="inline-flex items-center gap-2 rounded-card bg-surface-container-lowest px-6 py-3 text-base font-semibold text-primary transition-all hover:opacity-90 active:scale-[0.98] motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-on-primary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                                >
                                    {primaryLabel}
                                    <ArrowIcon className="h-4 w-4" />
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href="/login"
                                        className="rounded-card border border-on-primary/30 px-6 py-3 text-base font-semibold text-on-primary transition-colors hover:bg-on-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-on-primary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                                    >
                                        Sign in
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                {/* ── Footer ───────────────────────────────────────── */}
                <footer className="border-t border-outline-variant/60">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2.5">
                            <span className="grid h-7 w-7 place-items-center rounded-chip bg-primary text-on-primary text-sm font-bold">
                                F
                            </span>
                            <span className="text-sm font-semibold">FreelancerDash</span>
                        </div>
                        <p className="text-sm text-on-surface-variant">
                            © {new Date().getFullYear()} FreelancerDash. Built for freelancers.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
