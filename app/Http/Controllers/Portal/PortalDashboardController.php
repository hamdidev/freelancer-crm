<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PortalDashboardController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\Client $client */
        $client = auth('client')->user();

        return Inertia::render('Portal/Dashboard', [
            'client' => [
                'name'  => $client->name,
                'email' => $client->email,
            ],
            'stats' => [
                'open_invoices'   => $client->invoices()
                    ->whereIn('status', ['sent', 'overdue'])->count(),
                'pending_proposals' => $client->proposals()
                    ->where('status', 'sent')->count(),
                'active_contracts'  => $client->contracts()
                    ->where('status', 'active')->count(),
            ],
            'recent_invoices'  => $client->invoices()
                ->latest()->limit(5)
                ->get(['id', 'invoice_number', 'total_amount', 'status', 'due_date']),
            'pending_proposals' => $client->proposals()
                ->where('status', 'sent')->latest()->limit(3)
                ->get(['id', 'title', 'total_amount', 'created_at']),
        ]);
    }
}
