<?php

namespace Database\Factories;

use App\Enums\ProposalStatus;
use App\Models\Client;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Proposal>
 */
class ProposalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'client_id' => Client::factory(),
            'lead_id' => null,
            'title' => fake()->sentence(4),
            'content' => [],
            'status' => ProposalStatus::Draft,
            'total_cents' => 0,
            'currency' => 'EUR',
            'valid_until' => now()->addDays(30),
            'viewed_at' => null,
            'accepted_at' => null,
            'declined_at' => null,
            'client_note' => null,
        ];
    }

    public function sent(): static
    {
        return $this->state(['status' => ProposalStatus::Sent]);
    }

    public function viewed(): static
    {
        return $this->state([
            'status' => ProposalStatus::Viewed,
            'viewed_at' => now(),
        ]);
    }

    public function accepted(): static
    {
        return $this->state([
            'status' => ProposalStatus::Accepted,
            'accepted_at' => now(),
        ]);
    }
}
