<?php

use App\Models\Client;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('renders the contract edit page for the owner', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    $contract = Contract::create([
        'user_id' => $user->id,
        'client_id' => $client->id,
        'title' => 'Initial Contract',
        'body' => '<p>Terms</p>',
    ]);

    $this->actingAs($user)
        ->get(route('contracts.edit', $contract))
        ->assertSuccessful();
});

it('fails validation when creating a contract for another users client', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $foreignClient = Client::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->post(route('contracts.store'), [
            'client_id' => $foreignClient->id,
            'title' => 'Cross Tenant Contract',
            'body' => '<p>Terms</p>',
        ])
        ->assertSessionHasErrors('client_id');
});
