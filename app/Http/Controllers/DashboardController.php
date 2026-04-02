<?php

namespace App\Http\Controllers;

use App\Enums\InvoiceStatus;
use App\Enums\LeadStatus;
use App\Enums\ProposalStatus;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Proposal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        // ── Stats cards ───────────────────────────────────────
        $stats = [
            'total_unpaid' => Invoice::forUser($userId)
                ->whereIn('status', ['sent', 'viewed', 'partial', 'overdue'])
                ->sum('total_cents'),

            'total_paid_ytd' => Invoice::forUser($userId)
                ->where('status', InvoiceStatus::Paid)
                ->whereYear('paid_at', now()->year)
                ->sum('total_cents'),

            'overdue_count' => Invoice::forUser($userId)
                ->where('status', InvoiceStatus::Overdue)
                ->orWhere(function ($q) use ($userId) {
                    $q->forUser($userId)
                        ->whereIn('status', ['sent', 'viewed', 'partial'])
                        ->where('due_at', '<', now());
                })
                ->count(),

            'active_leads' => Lead::forUser($userId)
                ->whereNotIn('status', [
                    LeadStatus::Won->value,
                    LeadStatus::Lost->value,
                ])
                ->count(),
        ];

        // ── Revenue chart data ────────────────────────────────
        // Monthly revenue for current year
        $monthlyRevenue = Invoice::forUser($userId)
            ->where('status', InvoiceStatus::Paid)
            ->whereYear('paid_at', now()->year)
            ->selectRaw('
                EXTRACT(MONTH FROM paid_at) as month,
                SUM(total_cents) as total
            ')
            ->groupByRaw('EXTRACT(MONTH FROM paid_at)')
            ->orderByRaw('EXTRACT(MONTH FROM paid_at)')
            ->get()
            ->keyBy('month');

        // Build full 12-month array (fill missing months with 0)
        $months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];

        $revenueChart = collect(range(1, 12))->map(fn ($m) => [
            'month' => $months[$m - 1],
            'revenue' => (int) ($monthlyRevenue->get($m)?->total ?? 0),
        ])->toArray();

        // ── Active leads ──────────────────────────────────────
        $activeLeads = Lead::forUser($userId)
            ->with('client:id,contact_name,company_name')
            ->whereNotIn('status', [
                LeadStatus::Won->value,
                LeadStatus::Lost->value,
            ])
            ->orderByDesc('updated_at')
            ->take(5)
            ->get();

        // ── Pending proposals ─────────────────────────────────
        $pendingProposals = Proposal::where('user_id', $userId)
            ->with('client:id,contact_name,company_name')
            ->whereIn('status', [
                ProposalStatus::Sent->value,
                ProposalStatus::Viewed->value,
            ])
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        // ── Upcoming payments ─────────────────────────────────
        $upcomingPayments = Invoice::forUser($userId)
            ->with('client:id,contact_name,company_name')
            ->whereIn('status', ['sent', 'viewed', 'partial', 'overdue'])
            ->orderBy('due_at')
            ->take(5)
            ->get();

        // ── Activity stream ───────────────────────────────────
        $activities = DB::table('activity_log')
            ->where('causer_id', $userId)
            ->where('causer_type', 'App\\Models\\User')
            ->orderByDesc('created_at')
            ->take(10)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'description' => $a->description,
                'subject_type' => class_basename($a->subject_type ?? ''),
                'event' => $a->event,
                'created_at' => $a->created_at,
                'properties' => json_decode($a->properties ?? '{}', true),
            ]);

        return Inertia::render('Dashboard', compact(
            'stats',
            'revenueChart',
            'activeLeads',
            'pendingProposals',
            'upcomingPayments',
            'activities',
        ));
    }
}
