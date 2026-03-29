<?php

namespace App\StateMachines;

use App\Enums\InvoiceStatus;
use Illuminate\Validation\ValidationException;

class InvoiceStateMachine
{
    private const TRANSITIONS = [
        InvoiceStatus::Draft->value => [InvoiceStatus::Sent, InvoiceStatus::Void],
        InvoiceStatus::Sent->value => [InvoiceStatus::Viewed, InvoiceStatus::Paid, InvoiceStatus::Overdue, InvoiceStatus::Void],
        InvoiceStatus::Viewed->value => [InvoiceStatus::Partial, InvoiceStatus::Paid, InvoiceStatus::Overdue, InvoiceStatus::Void],
        InvoiceStatus::Partial->value => [InvoiceStatus::Paid, InvoiceStatus::Overdue, InvoiceStatus::Void],
        InvoiceStatus::Overdue->value => [InvoiceStatus::Paid, InvoiceStatus::Void],
        InvoiceStatus::Paid->value => [],
        InvoiceStatus::Void->value => [],
    ];

    public function __construct(private InvoiceStatus $current) {}

    public function canTransitionTo(InvoiceStatus $target): bool
    {
        $allowed = self::TRANSITIONS[$this->current->value] ?? [];

        return in_array($target, $allowed, strict: true);
    }

    public function transitionTo(InvoiceStatus $target): void
    {
        if (! $this->canTransitionTo($target)) {
            throw ValidationException::withMessages([
                'status' => "Cannot transition invoice from [{$this->current->value}] to [{$target->value}].",
            ]);
        }
    }
}
