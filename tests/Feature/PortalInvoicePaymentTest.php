<?php

use App\Enums\InvoiceStatus;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns gone when a client opens their own already paid invoice', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    $invoice = Invoice::factory()->create([
        'user_id' => $user->id,
        'client_id' => $client->id,
        'status' => InvoiceStatus::Paid,
        'paid_at' => now(),
    ]);

    $this->actingAs($client, 'client')
        ->get(route('portal.invoices.pay', $invoice))
        ->assertGone();
});

it('forbids a client from accessing another clients payment page', function () {
    $user = User::factory()->create();
    $ownClient = Client::factory()->create(['user_id' => $user->id]);
    $otherClient = Client::factory()->create(['user_id' => $user->id]);

    $invoice = Invoice::factory()->create([
        'user_id' => $user->id,
        'client_id' => $otherClient->id,
    ]);

    $this->actingAs($ownClient, 'client')
        ->get(route('portal.invoices.pay', $invoice))
        ->assertForbidden();
});

it('allows a client to confirm payment only for their own invoice', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    $invoice = Invoice::factory()->create([
        'user_id' => $user->id,
        'client_id' => $client->id,
    ]);

    $this->actingAs($client, 'client')
        ->post(route('portal.invoices.confirm-payment', $invoice))
        ->assertOk()
        ->assertJson(['paid' => false]);
});

it('forbids payment confirmation for another clients invoice', function () {
    $user = User::factory()->create();
    $ownClient = Client::factory()->create(['user_id' => $user->id]);
    $otherClient = Client::factory()->create(['user_id' => $user->id]);

    $invoice = Invoice::factory()->create([
        'user_id' => $user->id,
        'client_id' => $otherClient->id,
    ]);

    $this->actingAs($ownClient, 'client')
        ->post(route('portal.invoices.confirm-payment', $invoice))
        ->assertForbidden();
});
