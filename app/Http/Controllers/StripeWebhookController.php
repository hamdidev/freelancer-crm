<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function __construct(private InvoiceService $service) {}

    public function handle(Request $request): Response
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                config('services.stripe.webhook_secret')
            );
        } catch (SignatureVerificationException $e) {
            return response('Invalid signature.', 400);
        }

        match ($event->type) {
            'payment_intent.succeeded' => $this->handlePaymentSuccess($event->data->object),
            default => null,
        };

        return response('OK', 200);
    }

    private function handlePaymentSuccess(object $paymentIntent): void
    {
        $invoice = Invoice::where(
            'stripe_payment_intent_id',
            $paymentIntent->id
        )->first();

        if (! $invoice || $invoice->status->isTerminal()) {
            return;
        }

        $this->service->markPaid($invoice);
    }
}
