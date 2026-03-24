<?php

namespace App\StateMachines;

use App\Enums\ProposalStatus;
use Illuminate\Validation\ValidationException;

class ProposalStateMachine
{
    private const TRANSITIONS = [
        ProposalStatus::Draft->value    => [ProposalStatus::Sent],
        ProposalStatus::Sent->value     => [ProposalStatus::Viewed, ProposalStatus::Expired],
        ProposalStatus::Viewed->value   => [ProposalStatus::Accepted, ProposalStatus::Declined, ProposalStatus::Expired],
        ProposalStatus::Accepted->value => [],
        ProposalStatus::Declined->value => [ProposalStatus::Draft], // allow rework
        ProposalStatus::Expired->value  => [ProposalStatus::Draft], // allow rework
    ];

    public function __construct(private ProposalStatus $current) {}

    public function canTransitionTo(ProposalStatus $target): bool
    {
        $allowed = self::TRANSITIONS[$this->current->value] ?? [];
        return in_array($target, $allowed, strict: true);
    }

    public function transitionTo(ProposalStatus $target): void
    {
        if (!$this->canTransitionTo($target)) {
            throw ValidationException::withMessages([
                'status' => "Cannot transition proposal from [{$this->current->value}] to [{$target->value}].",
            ]);
        }
    }
}
