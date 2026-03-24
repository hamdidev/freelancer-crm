<?php

namespace App\Services;

use App\Enums\ProposalStatus;
use App\Events\ProposalActioned;
use App\Models\Proposal;
use App\StateMachines\ProposalStateMachine;
use Illuminate\Support\Facades\Mail;

class ProposalService
{
    /**
     * Send a proposal to the client — transitions Draft → Sent and emails the link.
     */
    public function send(Proposal $proposal): void
    {
        $machine = new ProposalStateMachine($proposal->status);
        $machine->transitionTo(ProposalStatus::Sent);

        $proposal->update(['status' => ProposalStatus::Sent]);

        // TODO Phase 3 extension: Mail::to($proposal->client->email)->send(new ProposalMail($proposal));
        // Queued mail will be added when we set up the mail driver
    }

    /**
     * Record a client viewing the proposal — transitions Sent → Viewed (once).
     */
    public function recordView(Proposal $proposal): void
    {
        if ($proposal->status !== ProposalStatus::Sent) return;

        $machine = new ProposalStateMachine($proposal->status);
        if (!$machine->canTransitionTo(ProposalStatus::Viewed)) return;

        $proposal->update([
            'status'    => ProposalStatus::Viewed,
            'viewed_at' => now(),
        ]);

        broadcast(new \App\Events\ProposalViewed($proposal))->toOthers();
    }

    /**
     * Client accepts the proposal.
     */
    public function accept(Proposal $proposal, ?string $note = null): void
    {
        $machine = new ProposalStateMachine($proposal->status);
        $machine->transitionTo(ProposalStatus::Accepted);

        $proposal->update([
            'status'      => ProposalStatus::Accepted,
            'accepted_at' => now(),
            'client_note' => $note,
        ]);

        broadcast(new ProposalActioned($proposal, 'accepted'))->toOthers();

        // TODO Phase 5: dispatch(new GenerateContractJob($proposal));
    }

    /**
     * Client declines the proposal.
     */
    public function decline(Proposal $proposal, ?string $note = null): void
    {
        $machine = new ProposalStateMachine($proposal->status);
        $machine->transitionTo(ProposalStatus::Declined);

        $proposal->update([
            'status'      => ProposalStatus::Declined,
            'declined_at' => now(),
            'client_note' => $note,
        ]);

        broadcast(new ProposalActioned($proposal, 'declined'))->toOthers();
    }

    /**
     * Calculate total_cents from content blocks.
     */
    public function calculateTotal(array $content): int
    {
        $total = 0;
        foreach ($content as $block) {
            if (($block['type'] ?? '') === 'pricing_item') {
                $qty   = (int)   ($block['attrs']['quantity']       ?? 0);
                $price = (int)   ($block['attrs']['unit_price_cents'] ?? 0);
                $total += $qty * $price;
            }
        }
        return $total;
    }
}
