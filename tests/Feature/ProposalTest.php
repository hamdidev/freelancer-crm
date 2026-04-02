<?php

use App\Enums\ProposalStatus;
use App\Mail\ProposalMail;
use App\Models\Client;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

// ── Index ──────────────────────────────────────────────────────────────────

it('shows proposals index for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('proposals.index'))
        ->assertSuccessful();
});

it('redirects unauthenticated users from proposals index', function () {
    $this->get(route('proposals.index'))->assertRedirect(route('login'));
});

// ── Store ──────────────────────────────────────────────────────────────────

it('creates a proposal for the authenticated user', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('proposals.store'), [
            'client_id' => $client->id,
            'title' => 'Brand Redesign',
            'content' => [],
            'currency' => 'EUR',
            'valid_until' => now()->addDays(14)->toDateString(),
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('proposals', [
        'user_id' => $user->id,
        'client_id' => $client->id,
        'title' => 'Brand Redesign',
        'status' => ProposalStatus::Draft->value,
    ]);
});

it('auto-generates a uuid token on proposal creation', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)->post(route('proposals.store'), [
        'client_id' => $client->id,
        'title' => 'Token Test',
        'currency' => 'EUR',
    ]);

    $proposal = Proposal::where('user_id', $user->id)->first();

    expect($proposal->token)->not->toBeNull()
        ->and(strlen($proposal->token))->toBe(36);
});

it('calculates total_cents from pricing_item blocks on store', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    $content = [
        ['type' => 'pricing_item', 'attrs' => ['quantity' => 2, 'unit_price_cents' => 5000]],
    ];

    $this->actingAs($user)->post(route('proposals.store'), [
        'client_id' => $client->id,
        'title' => 'Priced Proposal',
        'content' => $content,
        'currency' => 'EUR',
    ]);

    $proposal = Proposal::where('user_id', $user->id)->first();

    expect($proposal->total_cents)->toBe(10000);
});

it('fails validation when client_id is missing on store', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('proposals.store'), ['title' => 'No Client'])
        ->assertSessionHasErrors('client_id');
});

it('fails validation when creating a proposal for another users client', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $foreignClient = Client::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->post(route('proposals.store'), [
            'client_id' => $foreignClient->id,
            'title' => 'Cross Tenant Attempt',
            'content' => [],
            'currency' => 'EUR',
        ])
        ->assertSessionHasErrors('client_id');
});

// ── Update ─────────────────────────────────────────────────────────────────

it('updates a draft proposal owned by the user', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);
    $proposal = Proposal::factory()->create([
        'user_id' => $user->id,
        'client_id' => $client->id,
    ]);

    $this->actingAs($user)
        ->patch(route('proposals.update', $proposal), [
            'title' => 'Updated Title',
            'client_id' => $proposal->client_id,
            'content' => [],
        ])
        ->assertRedirect();

    expect($proposal->fresh()->title)->toBe('Updated Title');
});

it('forbids updating another user\'s proposal', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $proposal = Proposal::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->patch(route('proposals.update', $proposal), [
            'title' => 'Hacked',
            'client_id' => $proposal->client_id,
            'content' => [],
        ])
        ->assertForbidden();
});

// ── Send ───────────────────────────────────────────────────────────────────

it('sends a draft proposal to the client', function () {
    Mail::fake();

    $user = User::factory()->create();
    $proposal = Proposal::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('proposals.send', $proposal))
        ->assertRedirect();

    expect($proposal->fresh()->status)->toBe(ProposalStatus::Sent);
    Mail::assertSent(ProposalMail::class);
});

// ── Destroy ────────────────────────────────────────────────────────────────

it('deletes a draft proposal owned by the user', function () {
    $user = User::factory()->create();
    $proposal = Proposal::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('proposals.destroy', $proposal))
        ->assertRedirect(route('proposals.index'));

    $this->assertSoftDeleted('proposals', ['id' => $proposal->id]);
});

it('forbids deleting another user\'s proposal', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $proposal = Proposal::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->delete(route('proposals.destroy', $proposal))
        ->assertForbidden();
});

it('forbids deleting an accepted proposal', function () {
    $user = User::factory()->create();
    $proposal = Proposal::factory()->accepted()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('proposals.destroy', $proposal))
        ->assertForbidden();
});

// ── Public view ────────────────────────────────────────────────────────────

it('renders the public proposal view by token', function () {
    $proposal = Proposal::factory()->sent()->create();

    $this->get("/p/{$proposal->token}")->assertSuccessful();
});

it('returns 404 for an unknown token', function () {
    $this->get('/p/nonexistent-token')->assertNotFound();
});

it('marks a sent proposal as viewed on first public view', function () {
    $proposal = Proposal::factory()->sent()->create();

    $this->get("/p/{$proposal->token}");

    expect($proposal->fresh()->status)->toBe(ProposalStatus::Viewed)
        ->and($proposal->fresh()->viewed_at)->not->toBeNull();
});

it('does not re-mark a proposal viewed if already viewed', function () {
    $proposal = Proposal::factory()->viewed()->create();
    $viewedAt = $proposal->viewed_at;

    $this->get("/p/{$proposal->token}");

    expect($proposal->fresh()->viewed_at->eq($viewedAt))->toBeTrue();
});

// ── Client action ──────────────────────────────────────────────────────────

it('allows a client to accept a viewed proposal', function () {
    Mail::fake();

    $proposal = Proposal::factory()->viewed()->create();

    $this->post("/p/{$proposal->token}/action", [
        'action' => 'accept',
        'note' => 'Looks great!',
    ])->assertRedirect();

    expect($proposal->fresh()->status)->toBe(ProposalStatus::Accepted)
        ->and($proposal->fresh()->client_note)->toBe('Looks great!');
});

it('allows a client to decline a viewed proposal', function () {
    Mail::fake();

    $proposal = Proposal::factory()->viewed()->create();

    $this->post("/p/{$proposal->token}/action", [
        'action' => 'decline',
        'note' => 'Not the right fit.',
    ])->assertRedirect();

    expect($proposal->fresh()->status)->toBe(ProposalStatus::Declined);
});

it('validates the action field on client action', function () {
    $proposal = Proposal::factory()->viewed()->create();

    $this->post("/p/{$proposal->token}/action", ['action' => 'invalid'])
        ->assertSessionHasErrors('action');
});
