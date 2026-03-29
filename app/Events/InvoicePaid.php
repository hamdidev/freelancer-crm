<?php

namespace App\Events;

use App\Models\Invoice;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class InvoicePaid implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Invoice $invoice) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('user.'.$this->invoice->user_id);
    }

    public function broadcastAs(): string
    {
        return 'InvoicePaid';
    }

    public function broadcastWith(): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'invoice_number' => $this->invoice->number,
            'client_name' => $this->invoice->client->contact_name,
            'total_cents' => $this->invoice->total_cents,
            'currency' => $this->invoice->currency,
        ];
    }
}
