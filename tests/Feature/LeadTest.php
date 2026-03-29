<?php

use App\Enums\LeadStatus;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ── Index ──────────────────────────────────────────────────────────────────

it('shows leads page for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('leads.index'))
        ->assertSuccessful();
});

it('redirects unauthenticated users from leads index', function () {
    $this->get(route('leads.index'))->assertRedirect(route('login'));
});

it('only shows leads belonging to the authenticated user', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $myLead = Lead::factory()->create(['user_id' => $user->id]);
    $otherLead = Lead::factory()->create(['user_id' => $other->id]);

    $response = $this->actingAs($user)->get(route('leads.index'));

    $response->assertInertia(fn ($page) =>
        $page->where('leadsByStatus.'.$myLead->status->value.'.0.id', $myLead->id)
             ->missing('leadsByStatus.'.$myLead->status->value.'.1') // only one lead in this column
    );
});

// ── Store ──────────────────────────────────────────────────────────────────

it('creates a lead for the authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('leads.store'), [
            'title' => 'New Website Project',
            'source' => 'referral',
            'value_estimate' => 500000,
        ])
        ->assertRedirect(route('leads.index'));

    $this->assertDatabaseHas('leads', [
        'user_id' => $user->id,
        'title' => 'New Website Project',
        'status' => LeadStatus::New->value,
    ]);
});

it('fails validation when title is missing on store', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('leads.store'), [])
        ->assertSessionHasErrors('title');
});

// ── Update ─────────────────────────────────────────────────────────────────

it('updates a lead owned by the user', function () {
    $user = User::factory()->create();
    $lead = Lead::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patch(route('leads.update', $lead), ['title' => 'Updated Title'])
        ->assertRedirect();

    expect($lead->fresh()->title)->toBe('Updated Title');
});

it('forbids updating another user\'s lead', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $lead = Lead::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->patch(route('leads.update', $lead), ['title' => 'Hack'])
        ->assertForbidden();
});

// ── Update Status ──────────────────────────────────────────────────────────

it('transitions a lead status via state machine', function () {
    $user = User::factory()->create();
    $lead = Lead::factory()->create([
        'user_id' => $user->id,
        'status' => LeadStatus::New,
    ]);

    $this->actingAs($user)
        ->patch(route('leads.status', $lead), ['status' => 'contacted'])
        ->assertRedirect();

    expect($lead->fresh()->status)->toBe(LeadStatus::Contacted);
});

it('sets won_at timestamp when lead is marked won', function () {
    $user = User::factory()->create();
    $lead = Lead::factory()->create([
        'user_id' => $user->id,
        'status' => LeadStatus::Negotiation,
    ]);

    $this->actingAs($user)
        ->patch(route('leads.status', $lead), ['status' => 'won'])
        ->assertRedirect();

    expect($lead->fresh()->won_at)->not->toBeNull();
});

it('sets lost_at timestamp when lead is marked lost', function () {
    $user = User::factory()->create();
    $lead = Lead::factory()->create([
        'user_id' => $user->id,
        'status' => LeadStatus::New,
    ]);

    $this->actingAs($user)
        ->patch(route('leads.status', $lead), ['status' => 'lost'])
        ->assertRedirect();

    expect($lead->fresh()->lost_at)->not->toBeNull();
});

it('rejects an invalid state transition', function () {
    $user = User::factory()->create();
    $lead = Lead::factory()->won()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patch(route('leads.status', $lead), ['status' => 'new'])
        ->assertSessionHasErrors('status');
});

it('forbids updating status of another user\'s lead', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $lead = Lead::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->patch(route('leads.status', $lead), ['status' => 'contacted'])
        ->assertForbidden();
});

// ── Destroy ────────────────────────────────────────────────────────────────

it('deletes a lead owned by the user', function () {
    $user = User::factory()->create();
    $lead = Lead::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('leads.destroy', $lead))
        ->assertRedirect(route('leads.index'));

    $this->assertSoftDeleted('leads', ['id' => $lead->id]);
});

it('forbids deleting another user\'s lead', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $lead = Lead::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->delete(route('leads.destroy', $lead))
        ->assertForbidden();
});
