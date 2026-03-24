<?php

namespace App\Events;

use App\Models\Proposal;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProposalViewed implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Proposal $proposal) {}

    public function broadcastOn(): PrivateChannel
    {
        // Broadcasts to the freelancer's private channel
        return new PrivateChannel('user.' . $this->proposal->user_id);
    }

    public function broadcastAs(): string
    {
        return 'ProposalViewed';
    }

    public function broadcastWith(): array
    {
        return [
            'proposal_id'   => $this->proposal->id,
            'proposal_title' => $this->proposal->title,
            'client_name'   => $this->proposal->client->contact_name,
            'viewed_at'     => $this->proposal->viewed_at->toISOString(),
        ];
    }
}
