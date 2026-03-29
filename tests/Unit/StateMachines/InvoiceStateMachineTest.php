<?php

use App\Enums\InvoiceStatus;
use App\StateMachines\InvoiceStateMachine;
use Illuminate\Validation\ValidationException;

uses(Tests\TestCase::class);

it('allows Draft → Sent and Draft → Void', function () {
    $machine = new InvoiceStateMachine(InvoiceStatus::Draft);

    expect($machine->canTransitionTo(InvoiceStatus::Sent))->toBeTrue();
    expect($machine->canTransitionTo(InvoiceStatus::Void))->toBeTrue();
});

it('does not allow Draft → Paid directly', function () {
    $machine = new InvoiceStateMachine(InvoiceStatus::Draft);

    expect($machine->canTransitionTo(InvoiceStatus::Paid))->toBeFalse();
});

it('allows Sent → Viewed, Paid, Overdue, Void', function () {
    $machine = new InvoiceStateMachine(InvoiceStatus::Sent);

    expect($machine->canTransitionTo(InvoiceStatus::Viewed))->toBeTrue();
    expect($machine->canTransitionTo(InvoiceStatus::Paid))->toBeTrue();
    expect($machine->canTransitionTo(InvoiceStatus::Overdue))->toBeTrue();
    expect($machine->canTransitionTo(InvoiceStatus::Void))->toBeTrue();
});

it('allows Viewed → Partial, Paid, Overdue, Void', function () {
    $machine = new InvoiceStateMachine(InvoiceStatus::Viewed);

    expect($machine->canTransitionTo(InvoiceStatus::Partial))->toBeTrue();
    expect($machine->canTransitionTo(InvoiceStatus::Paid))->toBeTrue();
    expect($machine->canTransitionTo(InvoiceStatus::Overdue))->toBeTrue();
    expect($machine->canTransitionTo(InvoiceStatus::Void))->toBeTrue();
});

it('allows Partial → Paid, Overdue, Void', function () {
    $machine = new InvoiceStateMachine(InvoiceStatus::Partial);

    expect($machine->canTransitionTo(InvoiceStatus::Paid))->toBeTrue();
    expect($machine->canTransitionTo(InvoiceStatus::Overdue))->toBeTrue();
    expect($machine->canTransitionTo(InvoiceStatus::Void))->toBeTrue();
});

it('allows Overdue → Paid or Void', function () {
    $machine = new InvoiceStateMachine(InvoiceStatus::Overdue);

    expect($machine->canTransitionTo(InvoiceStatus::Paid))->toBeTrue();
    expect($machine->canTransitionTo(InvoiceStatus::Void))->toBeTrue();
    expect($machine->canTransitionTo(InvoiceStatus::Sent))->toBeFalse();
});

it('has no transitions from Paid (terminal)', function () {
    $machine = new InvoiceStateMachine(InvoiceStatus::Paid);

    expect($machine->canTransitionTo(InvoiceStatus::Void))->toBeFalse();
    expect($machine->canTransitionTo(InvoiceStatus::Draft))->toBeFalse();
});

it('has no transitions from Void (terminal)', function () {
    $machine = new InvoiceStateMachine(InvoiceStatus::Void);

    expect($machine->canTransitionTo(InvoiceStatus::Paid))->toBeFalse();
    expect($machine->canTransitionTo(InvoiceStatus::Draft))->toBeFalse();
});

it('throws a ValidationException for illegal transitions', function () {
    $machine = new InvoiceStateMachine(InvoiceStatus::Paid);

    $machine->transitionTo(InvoiceStatus::Draft);
})->throws(ValidationException::class);
