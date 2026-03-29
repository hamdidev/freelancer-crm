<?php

use App\Enums\InvoiceStatus;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ── Index ──────────────────────────────────────────────────────────────────

it('shows invoices index for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('invoices.index'))
        ->assertSuccessful();
});

it('redirects unauthenticated users from invoices index', function () {
    $this->get(route('invoices.index'))->assertRedirect(route('login'));
});

it('returns correct stats on index', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    Invoice::factory()->sent()->create([
        'user_id' => $user->id,
        'client_id' => $client->id,
        'total_cents' => 20000,
        'due_at' => now()->addDays(14),
    ]);

    Invoice::factory()->paid()->create([
        'user_id' => $user->id,
        'client_id' => $client->id,
        'total_cents' => 50000,
        'paid_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('invoices.index'));

    $response->assertInertia(fn ($page) => $page->where('stats.total_unpaid', 20000)
        ->where('stats.total_paid_ytd', 50000)
    );
});

// ── Store ──────────────────────────────────────────────────────────────────

it('creates an invoice with items for the authenticated user', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('invoices.store'), [
            'client_id' => $client->id,
            'currency' => 'EUR',
            'tax_rate' => 19.0,
            'issue_date' => now()->toDateString(),
            'due_at' => now()->addDays(14)->toDateString(),
            'items' => [
                [
                    'description' => 'Design work',
                    'quantity' => 1,
                    'unit_price_cents' => 100000,
                ],
            ],
        ])
        ->assertRedirect();

    $invoice = Invoice::where('user_id', $user->id)->first();

    expect($invoice)->not->toBeNull()
        ->and($invoice->status)->toBe(InvoiceStatus::Draft)
        ->and($invoice->number)->toStartWith('INV-')
        ->and($invoice->items)->toHaveCount(1);
});

it('fails validation when items are missing on store', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('invoices.store'), [
            'client_id' => $client->id,
            'tax_rate' => 19.0,
            'currency' => 'EUR',
            'issue_date' => now()->toDateString(),
            'due_at' => now()->addDays(14)->toDateString(),
        ])
        ->assertSessionHasErrors('items');
});

// ── Update ─────────────────────────────────────────────────────────────────

it('updates an invoice owned by the user', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);
    $invoice = Invoice::factory()->create([
        'user_id' => $user->id,
        'client_id' => $client->id,
    ]);

    $this->actingAs($user)
        ->patch(route('invoices.update', $invoice), [
            'client_id' => $client->id,
            'tax_rate' => 19.0,
            'issue_date' => now()->toDateString(),
            'due_at' => now()->addDays(30)->toDateString(),
            'items' => [
                [
                    'description' => 'Updated service',
                    'quantity' => 2,
                    'unit_price_cents' => 5000,
                ],
            ],
        ])
        ->assertRedirect();

    expect($invoice->fresh()->items)->toHaveCount(1);
    expect($invoice->fresh()->total_cents)->toBe(11900); // 10000 + 19% tax
});

it('forbids updating another user\'s invoice', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $invoice = Invoice::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->patch(route('invoices.update', $invoice), [
            'client_id' => $invoice->client_id,
            'tax_rate' => 19.0,
            'issue_date' => now()->toDateString(),
            'due_at' => now()->addDays(14)->toDateString(),
            'items' => [['description' => 'x', 'quantity' => 1, 'unit_price_cents' => 1000]],
        ])
        ->assertForbidden();
});

it('forbids updating a paid (terminal) invoice', function () {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->paid()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patch(route('invoices.update', $invoice), [
            'client_id' => $invoice->client_id,
            'tax_rate' => 19.0,
            'issue_date' => now()->toDateString(),
            'due_at' => now()->addDays(14)->toDateString(),
            'items' => [['description' => 'x', 'quantity' => 1, 'unit_price_cents' => 1000]],
        ])
        ->assertForbidden();
});

// ── Send ───────────────────────────────────────────────────────────────────

it('sends a draft invoice, transitioning it to Sent', function () {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post(route('invoices.send', $invoice))
        ->assertRedirect();

    expect($invoice->fresh()->status)->toBe(InvoiceStatus::Sent);
});

it('forbids sending another user\'s invoice', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $invoice = Invoice::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->post(route('invoices.send', $invoice))
        ->assertForbidden();
});

// ── Destroy ────────────────────────────────────────────────────────────────

it('deletes a draft invoice owned by the user', function () {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('invoices.destroy', $invoice))
        ->assertRedirect(route('invoices.index'));

    $this->assertSoftDeleted('invoices', ['id' => $invoice->id]);
});

it('forbids deleting another user\'s invoice', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $invoice = Invoice::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->delete(route('invoices.destroy', $invoice))
        ->assertForbidden();
});

it('forbids deleting a sent invoice (only draft allowed)', function () {
    $user = User::factory()->create();
    $invoice = Invoice::factory()->sent()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete(route('invoices.destroy', $invoice))
        ->assertForbidden();
});

// ── Invoice model ──────────────────────────────────────────────────────────

it('marks an invoice as overdue when unpaid and past due date', function () {
    $invoice = Invoice::factory()->overdue()->make();

    expect($invoice->isOverdue())->toBeTrue();
});

it('does not mark a paid invoice as overdue', function () {
    $invoice = Invoice::factory()->paid()->make(['due_at' => now()->subDays(5)]);

    expect($invoice->isOverdue())->toBeFalse();
});
