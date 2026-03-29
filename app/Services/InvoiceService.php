<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Events\InvoicePaid;
use App\Mail\InvoiceMail;
use App\Models\Invoice;
use App\Models\User;
use App\StateMachines\InvoiceStateMachine;
use Illuminate\Support\Facades\Mail;
use Stripe\StripeClient;

class InvoiceService
{
    public function __construct(
        private InvoiceNumberService $numberService,
        private StripeClient $stripe,
    ) {}

    /**
     * Calculate totals from line items and tax rate.
     */
    public function calculateTotals(array $items, float $taxRate): array
    {
        $subtotal = collect($items)->sum(
            fn ($item) => (int) round($item['quantity'] * $item['unit_price_cents'])
        );

        $tax = (int) round($subtotal * ($taxRate / 100));
        $total = $subtotal + $tax;

        return compact('subtotal', 'tax', 'total');
    }

    /**
     * Create a new invoice with items.
     */
    public function create(User $user, array $data): Invoice
    {
        $totals = $this->calculateTotals(
            $data['items'] ?? [],
            (float) ($data['tax_rate'] ?? 19.0)
        );

        $invoice = $user->invoices()->create([
            'client_id' => $data['client_id'],
            'project_id' => $data['project_id'] ?? null,
            'number' => $this->numberService->generate($user->id),
            'currency' => $data['currency'] ?? $user->currency,
            'subtotal_cents' => $totals['subtotal'],
            'tax_rate' => $data['tax_rate'] ?? 19.0,
            'tax_cents' => $totals['tax'],
            'total_cents' => $totals['total'],
            'issue_date' => $data['issue_date'] ?? now()->toDateString(),
            'due_at' => $data['due_at'],
            'service_date' => $data['service_date'] ?? null,
            'notes' => $data['notes'] ?? null,
            'recurring' => $data['recurring'] ?? false,
            'recurring_interval' => $data['recurring_interval'] ?? null,
        ]);

        foreach ($data['items'] ?? [] as $i => $item) {
            $invoice->items()->create([
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price_cents' => $item['unit_price_cents'],
                'total_cents' => (int) round($item['quantity'] * $item['unit_price_cents']),
                'position' => $i,
                'time_entry_ids' => $item['time_entry_ids'] ?? null,
            ]);
        }

        return $invoice;
    }

    /**
     * Sync items on update (delete + recreate for simplicity).
     */
    public function updateItems(Invoice $invoice, array $items, float $taxRate): void
    {
        $invoice->items()->delete();

        $totals = $this->calculateTotals($items, $taxRate);

        foreach ($items as $i => $item) {
            $invoice->items()->create([
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price_cents' => $item['unit_price_cents'],
                'total_cents' => (int) round($item['quantity'] * $item['unit_price_cents']),
                'position' => $i,
                'time_entry_ids' => $item['time_entry_ids'] ?? null,
            ]);
        }

        $invoice->update([
            'subtotal_cents' => $totals['subtotal'],
            'tax_cents' => $totals['tax'],
            'total_cents' => $totals['total'],
            'tax_rate' => $taxRate,
        ]);
    }

    /**
     * Send invoice — transitions Draft → Sent.
     */
    public function send(Invoice $invoice): void
    {
        $machine = new InvoiceStateMachine($invoice->status);
        $machine->transitionTo(InvoiceStatus::Sent);

        $invoice->update(['status' => InvoiceStatus::Sent]);

        Mail::to($invoice->client->email)
            ->send(new InvoiceMail($invoice->load('items')));
    }

    /**
     * Create Stripe PaymentIntent for the invoice total.
     */
    public function createPaymentIntent(Invoice $invoice): string
    {
        $intent = $this->stripe->paymentIntents->create([
            'amount' => $invoice->total_cents,
            'currency' => strtolower($invoice->currency),
            'metadata' => ['invoice_id' => $invoice->id],
        ]);

        $invoice->update(['stripe_payment_intent_id' => $intent->id]);

        return $intent->client_secret;
    }

    /**
     * Mark invoice as paid — called from webhook.
     */
    public function markPaid(Invoice $invoice): void
    {
        $machine = new InvoiceStateMachine($invoice->status);
        $machine->transitionTo(InvoiceStatus::Paid);

        $invoice->update([
            'status' => InvoiceStatus::Paid,
            'paid_at' => now(),
        ]);

        broadcast(new InvoicePaid($invoice))->toOthers();
    }
}
