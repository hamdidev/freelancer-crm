<?php

namespace App\StateMachines;

use App\Enums\LeadStatus;
use Illuminate\Validation\ValidationException;

class LeadStateMachine
{
    /**
     * Allowed transitions: from → [to, to, ...]
     */
    private const TRANSITIONS = [
        LeadStatus::New->value          => [LeadStatus::Contacted, LeadStatus::Lost],
        LeadStatus::Contacted->value    => [LeadStatus::ProposalSent, LeadStatus::Negotiation, LeadStatus::Lost],
        LeadStatus::ProposalSent->value => [LeadStatus::Negotiation, LeadStatus::Won, LeadStatus::Lost],
        LeadStatus::Negotiation->value  => [LeadStatus::Won, LeadStatus::Lost],
        LeadStatus::Won->value          => [],
        LeadStatus::Lost->value         => [LeadStatus::New], // allow re-opening
    ];

    public function __construct(private LeadStatus $current) {}

    public function canTransitionTo(LeadStatus $target): bool
    {
        $allowed = self::TRANSITIONS[$this->current->value] ?? [];

        return in_array($target, $allowed, strict: true);
    }

    public function transitionTo(LeadStatus $target): void
    {
        if (!$this->canTransitionTo($target)) {
            throw ValidationException::withMessages([
                'status' => "Cannot transition from [{$this->current->value}] to [{$target->value}].",
            ]);
        }
    }

    public function allowedTransitions(): array
    {
        return self::TRANSITIONS[$this->current->value] ?? [];
    }
}
