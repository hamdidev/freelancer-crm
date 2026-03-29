<?php

namespace Database\Factories;

use App\Enums\InvoiceStatus;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
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
            'project_id' => null,
            'number' => 'INV-'.now()->year.'-'.fake()->unique()->numerify('####'),
            'status' => InvoiceStatus::Draft,
            'currency' => 'EUR',
            'subtotal_cents' => 10000,
            'tax_rate' => 19.00,
            'tax_cents' => 1900,
            'total_cents' => 11900,
            'issue_date' => now()->toDateString(),
            'due_at' => now()->addDays(14)->toDateString(),
            'service_date' => null,
            'paid_at' => null,
            'viewed_at' => null,
            'notes' => null,
            'recurring' => false,
            'recurring_interval' => null,
        ];
    }

    public function sent(): static
    {
        return $this->state(['status' => InvoiceStatus::Sent]);
    }

    public function paid(): static
    {
        return $this->state([
            'status' => InvoiceStatus::Paid,
            'paid_at' => now(),
        ]);
    }

    public function overdue(): static
    {
        return $this->state([
            'status' => InvoiceStatus::Sent,
            'due_at' => now()->subDays(5)->toDateString(),
        ]);
    }
}
