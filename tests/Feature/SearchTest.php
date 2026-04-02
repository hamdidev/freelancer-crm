<?php

use App\Enums\ContractStatus;
use App\Enums\InvoiceStatus;
use App\Models\Client;
use App\Models\Contract;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;

uses(RefreshDatabase::class);

beforeEach(function () {
    Config::set('scout.driver', 'collection');
});

it('redirects guests from search', function () {
    $this->get('/search?q=test')
        ->assertRedirect(route('login'));
});

it('returns only results owned by the authenticated user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $ownClient = Client::factory()->create([
        'user_id' => $user->id,
        'company_name' => 'Acme Own',
    ]);

    Client::factory()->create([
        'user_id' => $otherUser->id,
        'company_name' => 'Acme Other',
    ]);

    $response = $this->actingAs($user)
        ->getJson('/search?q=Acme');

    $response->assertOk();

    $titles = collect($response->json('results'))->pluck('title')->all();

    expect($titles)->toContain('Acme Own')
        ->and($titles)->not->toContain('Acme Other');

    $ids = collect($response->json('results'))
        ->where('type', 'client')
        ->pluck('id')
        ->all();

    expect($ids)->toContain($ownClient->id);
});

it('returns list URL for terminal invoices and contracts', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    $paidInvoice = Invoice::factory()->create([
        'user_id' => $user->id,
        'client_id' => $client->id,
        'number' => 'INV-TERM-0001',
        'status' => InvoiceStatus::Paid,
        'paid_at' => now(),
    ]);

    $signedContract = Contract::create([
        'user_id' => $user->id,
        'client_id' => $client->id,
        'title' => 'Terminal Contract Title',
        'body' => '<p>Contract body</p>',
        'status' => ContractStatus::Signed,
        'signed_at' => now(),
    ]);

    $invoiceResponse = $this->actingAs($user)
        ->getJson('/search?q=INV-TERM-0001');

    $invoiceResponse->assertOk();

    $invoiceResult = collect($invoiceResponse->json('results'))
        ->firstWhere('id', $paidInvoice->id);

    expect($invoiceResult)->not->toBeNull()
        ->and($invoiceResult['url'])->toBe('/invoices');

    $contractResponse = $this->actingAs($user)
        ->getJson('/search?q=Terminal Contract Title');

    $contractResponse->assertOk();

    $contractResult = collect($contractResponse->json('results'))
        ->firstWhere('id', $signedContract->id);

    expect($contractResult)->not->toBeNull()
        ->and($contractResult['url'])->toBe('/contracts');
});

it('returns edit URL for non terminal invoices and contracts', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    $draftInvoice = Invoice::factory()->create([
        'user_id' => $user->id,
        'client_id' => $client->id,
        'number' => 'INV-EDIT-0001',
        'status' => InvoiceStatus::Draft,
    ]);

    $draftContract = Contract::create([
        'user_id' => $user->id,
        'client_id' => $client->id,
        'title' => 'Editable Contract Title',
        'body' => '<p>Contract body</p>',
        'status' => ContractStatus::Draft,
    ]);

    $invoiceResponse = $this->actingAs($user)
        ->getJson('/search?q=INV-EDIT-0001');

    $invoiceResponse->assertOk();

    $invoiceResult = collect($invoiceResponse->json('results'))
        ->firstWhere('id', $draftInvoice->id);

    expect($invoiceResult)->not->toBeNull()
        ->and($invoiceResult['url'])->toBe("/invoices/{$draftInvoice->id}/edit");

    $contractResponse = $this->actingAs($user)
        ->getJson('/search?q=Editable Contract Title');

    $contractResponse->assertOk();

    $contractResult = collect($contractResponse->json('results'))
        ->firstWhere('id', $draftContract->id);

    expect($contractResult)->not->toBeNull()
        ->and($contractResult['url'])->toBe("/contracts/{$draftContract->id}/edit");
});

it('defines typesense query fields for every searchable model', function () {
    $queryFields = [
        Lead::class => 'title,status,source,notes',
        Proposal::class => 'title,status',
        Invoice::class => 'number,status',
        Client::class => 'contact_name,company_name,email',
        Contract::class => 'title,status',
    ];

    foreach ($queryFields as $modelClass => $expectedQueryBy) {
        expect(config("scout.typesense.model-settings.{$modelClass}.search-parameters.query_by"))
            ->toBe($expectedQueryBy);
    }
});
