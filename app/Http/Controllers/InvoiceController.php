<?php

namespace App\Http\Controllers;

use App\Enums\InvoiceStatus;
use App\Models\Client;
use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function __construct(private InvoiceService $service) {}

    public function index(Request $request): Response
    {
        $invoices = Invoice::forUser($request->user()->id)
            ->with('client:id,contact_name,company_name')
            ->orderByDesc('created_at')
            ->get();

        $stats = [
            'total_unpaid' => $invoices->filter(fn ($i) => $i->status->isUnpaid())->sum('total_cents'),
            'total_paid_ytd' => $invoices->filter(
                fn ($i) => $i->status === InvoiceStatus::Paid
                    && optional($i->paid_at)->year === now()->year
            )->sum('total_cents'),
            'overdue_count' => $invoices->filter(fn ($i) => $i->isOverdue())->count(),
        ];

        return Inertia::render('Invoices/Index', compact('invoices', 'stats'));
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Invoices/Create', [
            'clients' => Client::where('user_id', $request->user()->id)
                ->select('id', 'contact_name', 'company_name')
                ->get(),
            'next_number' => 'Preview only — assigned on save',
            'defaults' => [
                'tax_rate' => 19.0,
                'currency' => $request->user()->currency,
                'due_days' => 14,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'project_id' => ['nullable', 'integer'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price_cents' => ['required', 'integer', 'min:0'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'currency' => ['required', 'string', 'size:3'],
            'due_at' => ['required', 'date'],
            'issue_date' => ['required', 'date'],
            'service_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'recurring' => ['nullable', 'boolean'],
            'recurring_interval' => ['nullable', 'in:weekly,monthly'],
        ]);

        $invoice = $this->service->create($request->user(), $data);

        return redirect()->route('invoices.index', $invoice)
            ->with('success', 'Invoice created.');
    }

    public function edit(Request $request, Invoice $invoice): Response
    {
        $this->authorize('update', $invoice);

        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice->load(['client:id,contact_name,company_name', 'items']),
            'clients' => Client::where('user_id', $request->user()->id)
                ->select('id', 'contact_name', 'company_name')
                ->get(),
        ]);
    }

    public function update(Request $request, Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $data = $request->validate([
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price_cents' => ['required', 'integer', 'min:0'],
            'tax_rate' => ['required', 'numeric'],
            'due_at' => ['required', 'date'],
            'issue_date' => ['required', 'date'],
            'service_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $invoice->update([
            'client_id' => $data['client_id'],
            'due_at' => $data['due_at'],
            'issue_date' => $data['issue_date'],
            'service_date' => $data['service_date'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        $this->service->updateItems($invoice, $data['items'], (float) $data['tax_rate']);

        return back()->with('success', 'Invoice updated.');
    }

    public function send(Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);
        $this->service->send($invoice);

        return back()->with('success', 'Invoice sent to client.');
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        $this->authorize('delete', $invoice);
        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted.');
    }

    // ── Client payment portal ────────────────────────────────

    public function pay(Request $request, Invoice $invoice)
    {
        if ($invoice->status === InvoiceStatus::Paid) {
            abort(410, 'This invoice has already been paid.');
        }

        $clientSecret = $this->service->createPaymentIntent($invoice);

        return Inertia::render('Invoices/Pay', [
            'invoice' => $invoice->load('items'),
            'clientSecret' => $clientSecret,
            'stripeKey' => config('services.stripe.key'),
        ]);
    }

    public function confirmPayment(Invoice $invoice): JsonResponse
    {
        $marked = $this->service->confirmPayment($invoice);

        return response()->json(['paid' => $marked || $invoice->fresh()->status === InvoiceStatus::Paid]);
    }
}
