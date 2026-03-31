<?php

namespace App\Events;

use App\Models\Contract;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContractSigned implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Contract $contract) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('user.'.$this->contract->user_id);
    }

    public function broadcastAs(): string
    {
        return 'ContractSigned';
    }

    public function broadcastWith(): array
    {
        return [
            'contract_id' => $this->contract->id,
            'contract_title' => $this->contract->title,
            'client_name' => $this->contract->client->contact_name,
            'signed_at' => $this->contract->signed_at->toISOString(),
        ];
    }
}
