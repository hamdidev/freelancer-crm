<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $client = $request->user('client');

        $contracts = Contract::where('client_id', $client->id)
            ->whereIn('status', ['sent', 'signed'])
            ->orderByDesc('created_at')
            ->get();

        $invoices = Invoice::where('client_id', $client->id)
            ->with('items')
            ->orderByDesc('created_at')
            ->get();

        $stats = [
            'pending_contracts' => $contracts->where('status', 'sent')->count(),
            'unpaid_invoices' => $invoices->whereIn('status', ['sent', 'viewed', 'overdue'])->count(),
            'total_paid' => $invoices->where('status', 'paid')->sum('total_cents'),
        ];

        return Inertia::render('Portal/Dashboard', compact(
            'contracts',
            'invoices',
            'stats',
            'client'
        ));
    }
}
