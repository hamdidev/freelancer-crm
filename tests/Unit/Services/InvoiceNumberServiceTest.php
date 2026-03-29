<?php

use App\Models\Client;
use App\Models\Invoice;
use App\Models\User;
use App\Services\InvoiceNumberService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);

it('generates the first invoice number for a new user', function () {
    $user = User::factory()->create();
    $service = new InvoiceNumberService;

    $number = $service->generate($user->id);

    expect($number)->toBe('INV-'.now()->year.'-0001');
});

it('generates sequential numbers for subsequent invoices', function () {
    $user = User::factory()->create();
    $service = new InvoiceNumberService;

    // Simulate one existing invoice for this user this year
    Invoice::factory()->create([
        'user_id' => $user->id,
        'client_id' => Client::factory()->create(['user_id' => $user->id])->id,
        'number' => 'INV-'.now()->year.'-0001',
    ]);

    $number = $service->generate($user->id);

    expect($number)->toBe('INV-'.now()->year.'-0002');
});

it('counts soft-deleted invoices to avoid number gaps', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);
    $service = new InvoiceNumberService;

    $invoice = Invoice::factory()->create([
        'user_id' => $user->id,
        'client_id' => $client->id,
        'number' => 'INV-'.now()->year.'-0001',
    ]);
    $invoice->delete();

    $number = $service->generate($user->id);

    expect($number)->toBe('INV-'.now()->year.'-0002');
});

it('sequences are isolated per user', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $service = new InvoiceNumberService;

    Invoice::factory()->create([
        'user_id' => $user1->id,
        'client_id' => Client::factory()->create(['user_id' => $user1->id])->id,
        'number' => 'INV-'.now()->year.'-0001',
    ]);

    $number = $service->generate($user2->id);

    expect($number)->toBe('INV-'.now()->year.'-0001');
});
