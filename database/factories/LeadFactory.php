<?php

namespace Database\Factories;

use App\Enums\LeadStatus;
use App\Models\Client;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lead>
 */
class LeadFactory extends Factory
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
            'title' => fake()->sentence(3),
            'status' => LeadStatus::New,
            'source' => fake()->randomElement(['referral', 'website', 'email', null]),
            'value_estimate' => fake()->numberBetween(100000, 1000000),
            'position' => fake()->numberBetween(0, 100),
            'notes' => null,
            'won_at' => null,
            'lost_at' => null,
        ];
    }

    public function won(): static
    {
        return $this->state([
            'status' => LeadStatus::Won,
            'won_at' => now(),
        ]);
    }

    public function lost(): static
    {
        return $this->state([
            'status' => LeadStatus::Lost,
            'lost_at' => now(),
        ]);
    }
}
