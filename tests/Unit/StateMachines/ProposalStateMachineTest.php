<?php

use App\Enums\ProposalStatus;
use App\StateMachines\ProposalStateMachine;
use Illuminate\Validation\ValidationException;

uses(Tests\TestCase::class);

it('allows Draft → Sent', function () {
    $machine = new ProposalStateMachine(ProposalStatus::Draft);

    expect($machine->canTransitionTo(ProposalStatus::Sent))->toBeTrue();
});

it('does not allow Draft → Accepted directly', function () {
    $machine = new ProposalStateMachine(ProposalStatus::Draft);

    expect($machine->canTransitionTo(ProposalStatus::Accepted))->toBeFalse();
    expect($machine->canTransitionTo(ProposalStatus::Declined))->toBeFalse();
    expect($machine->canTransitionTo(ProposalStatus::Viewed))->toBeFalse();
});

it('allows Sent → Viewed', function () {
    $machine = new ProposalStateMachine(ProposalStatus::Sent);

    expect($machine->canTransitionTo(ProposalStatus::Viewed))->toBeTrue();
    expect($machine->canTransitionTo(ProposalStatus::Expired))->toBeTrue();
});

it('allows Viewed → Accepted or Declined', function () {
    $machine = new ProposalStateMachine(ProposalStatus::Viewed);

    expect($machine->canTransitionTo(ProposalStatus::Accepted))->toBeTrue();
    expect($machine->canTransitionTo(ProposalStatus::Declined))->toBeTrue();
    expect($machine->canTransitionTo(ProposalStatus::Expired))->toBeTrue();
});

it('has no allowed transitions from Accepted (terminal)', function () {
    $machine = new ProposalStateMachine(ProposalStatus::Accepted);

    expect($machine->canTransitionTo(ProposalStatus::Declined))->toBeFalse();
    expect($machine->canTransitionTo(ProposalStatus::Draft))->toBeFalse();
});

it('allows Declined → Draft for rework', function () {
    $machine = new ProposalStateMachine(ProposalStatus::Declined);

    expect($machine->canTransitionTo(ProposalStatus::Draft))->toBeTrue();
});

it('allows Expired → Draft for rework', function () {
    $machine = new ProposalStateMachine(ProposalStatus::Expired);

    expect($machine->canTransitionTo(ProposalStatus::Draft))->toBeTrue();
});

it('throws a ValidationException for illegal transitions', function () {
    $machine = new ProposalStateMachine(ProposalStatus::Accepted);

    $machine->transitionTo(ProposalStatus::Draft);
})->throws(ValidationException::class);

it('throws a ValidationException going Draft → Accepted directly', function () {
    $machine = new ProposalStateMachine(ProposalStatus::Draft);

    $machine->transitionTo(ProposalStatus::Accepted);
})->throws(ValidationException::class);
