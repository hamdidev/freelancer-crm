<?php

namespace App\StateMachines;

use App\Enums\ContractStatus;
use Illuminate\Validation\ValidationException;

class ContractStateMachine
{
    private const TRANSITIONS = [
        ContractStatus::Draft->value => [ContractStatus::Sent],
        ContractStatus::Sent->value => [ContractStatus::Signed, ContractStatus::Rejected],
        ContractStatus::Signed->value => [],
        ContractStatus::Rejected->value => [ContractStatus::Draft], // allow rework
    ];

    public function __construct(private ContractStatus $current) {}

    public function canTransitionTo(ContractStatus $target): bool
    {
        $allowed = self::TRANSITIONS[$this->current->value] ?? [];

        return in_array($target, $allowed, strict: true);
    }

    public function transitionTo(ContractStatus $target): void
    {
        if (! $this->canTransitionTo($target)) {
            throw ValidationException::withMessages([
                'status' => "Cannot transition contract from [{$this->current->value}] to [{$target->value}].",
            ]);
        }
    }
}
