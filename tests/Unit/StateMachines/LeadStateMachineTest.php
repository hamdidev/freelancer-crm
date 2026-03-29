<?php

use App\Enums\LeadStatus;
use App\StateMachines\LeadStateMachine;
use Illuminate\Validation\ValidationException;

uses(Tests\TestCase::class);

it('allows valid transitions from New', function () {
    $machine = new LeadStateMachine(LeadStatus::New);

    expect($machine->canTransitionTo(LeadStatus::Contacted))->toBeTrue();
    expect($machine->canTransitionTo(LeadStatus::Lost))->toBeTrue();
});

it('rejects invalid transitions from New', function () {
    $machine = new LeadStateMachine(LeadStatus::New);

    expect($machine->canTransitionTo(LeadStatus::Won))->toBeFalse();
    expect($machine->canTransitionTo(LeadStatus::Negotiation))->toBeFalse();
    expect($machine->canTransitionTo(LeadStatus::ProposalSent))->toBeFalse();
});

it('allows valid transitions from Contacted', function () {
    $machine = new LeadStateMachine(LeadStatus::Contacted);

    expect($machine->canTransitionTo(LeadStatus::ProposalSent))->toBeTrue();
    expect($machine->canTransitionTo(LeadStatus::Negotiation))->toBeTrue();
    expect($machine->canTransitionTo(LeadStatus::Lost))->toBeTrue();
});

it('allows valid transitions from ProposalSent', function () {
    $machine = new LeadStateMachine(LeadStatus::ProposalSent);

    expect($machine->canTransitionTo(LeadStatus::Negotiation))->toBeTrue();
    expect($machine->canTransitionTo(LeadStatus::Won))->toBeTrue();
    expect($machine->canTransitionTo(LeadStatus::Lost))->toBeTrue();
});

it('allows reopening a Lost lead', function () {
    $machine = new LeadStateMachine(LeadStatus::Lost);

    expect($machine->canTransitionTo(LeadStatus::New))->toBeTrue();
});

it('has no allowed transitions from Won (terminal)', function () {
    $machine = new LeadStateMachine(LeadStatus::Won);

    expect($machine->allowedTransitions())->toBeEmpty();
    expect($machine->canTransitionTo(LeadStatus::Lost))->toBeFalse();
});

it('throws a ValidationException for illegal transitions', function () {
    $machine = new LeadStateMachine(LeadStatus::Won);

    $machine->transitionTo(LeadStatus::New);
})->throws(ValidationException::class);

it('throws a ValidationException skipping stages', function () {
    $machine = new LeadStateMachine(LeadStatus::New);

    $machine->transitionTo(LeadStatus::Won);
})->throws(ValidationException::class);

it('returns the correct allowed transitions list', function () {
    $machine = new LeadStateMachine(LeadStatus::Negotiation);

    expect($machine->allowedTransitions())->toEqualCanonicalizing([LeadStatus::Won, LeadStatus::Lost]);
});
