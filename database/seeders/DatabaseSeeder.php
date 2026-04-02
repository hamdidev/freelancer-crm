<?php

namespace Database\Seeders;

use App\Enums\LeadStatus;
use App\Enums\ProposalStatus;
use App\Models\Client;
use App\Models\Lead;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Freelancer account ────────────────────────────────
        $user = User::firstOrCreate(
            ['email' => 'freelancer@test.com'],
            [
                'name' => 'Alex Sterling',
                'password' => Hash::make('password'),
                'timezone' => 'Europe/Berlin',
                'currency' => 'EUR',
                'brand_color' => '#1A4F8B',
                'company_name' => 'Sterling Digital GmbH',
                'steuernummer' => '12/345/67890',
                'ust_idnr' => 'DE123456789',
                'phone' => '+49 30 12345678',
                'address' => 'Unter den Linden 1',
                'city' => 'Berlin',
                'country' => 'DE',
            ]
        );

        // ── Clients ───────────────────────────────────────────
        $clientsData = [
            [
                'contact_name' => 'Marcus Thorne',
                'company_name' => 'Vanguard Logistics GmbH',
                'email' => 'marcus@vanguard.de',
                'phone' => '+49 30 11223344',
                'city' => 'Berlin',
                'country' => 'DE',
                'vat_number' => 'DE987654321',
            ],
            [
                'contact_name' => 'Sarah Jenkins',
                'company_name' => 'Aether Systems AG',
                'email' => 'sarah@aether.de',
                'phone' => '+49 89 55667788',
                'city' => 'München',
                'country' => 'DE',
                'vat_number' => 'DE111222333',
            ],
            [
                'contact_name' => 'Klaus Müller',
                'company_name' => 'Nexus Corp GmbH',
                'email' => 'k.mueller@nexus.de',
                'phone' => '+49 40 99887766',
                'city' => 'Hamburg',
                'country' => 'DE',
                'vat_number' => null,
            ],
            [
                'contact_name' => 'Anna Hoffmann',
                'company_name' => null, // freelancer client, no company
                'email' => 'anna.hoffmann@gmail.com',
                'phone' => '+49 211 44556677',
                'city' => 'Düsseldorf',
                'country' => 'DE',
                'vat_number' => null,
            ],
        ];

        $clients = [];
        foreach ($clientsData as $clientData) {
            $clients[] = Client::firstOrCreate(
                ['user_id' => $user->id, 'email' => $clientData['email']],
                array_merge($clientData, ['user_id' => $user->id])
            );
        }

        // ── Leads ─────────────────────────────────────────────
        $leadsData = [
            [
                'client_id' => $clients[0]->id,
                'title' => 'Vanguard — Re-branding & Digital Strategy',
                'status' => LeadStatus::ProposalSent,
                'source' => 'Referral',
                'value_estimate' => 1175000, // €11,750
                'position' => 1,
                'notes' => 'Very interested. Decision expected end of month.',
            ],
            [
                'client_id' => $clients[1]->id,
                'title' => 'Aether — SaaS Platform Design Audit',
                'status' => LeadStatus::Contacted,
                'source' => 'LinkedIn',
                'value_estimate' => 450000, // €4,500
                'position' => 1,
                'notes' => 'Had intro call. Sending proposal next week.',
            ],
            [
                'client_id' => $clients[2]->id,
                'title' => 'Nexus — Monthly Retainer',
                'status' => LeadStatus::Won,
                'source' => 'Cold Outreach',
                'value_estimate' => 250000, // €2,500/mo
                'position' => 1,
                'won_at' => now()->subDays(5),
            ],
            [
                'client_id' => null,
                'title' => 'SolarOne Energy — Web App',
                'status' => LeadStatus::New,
                'source' => 'Website',
                'value_estimate' => 800000, // €8,000
                'position' => 2,
                'notes' => 'Inbound inquiry via contact form.',
            ],
            [
                'client_id' => $clients[3]->id,
                'title' => 'Anna — Portfolio Website',
                'status' => LeadStatus::Negotiation,
                'source' => 'Referral',
                'value_estimate' => 150000, // €1,500
                'position' => 1,
                'notes' => 'Negotiating scope and timeline.',
            ],
        ];

        $leads = [];
        foreach ($leadsData as $leadData) {
            $leads[] = Lead::firstOrCreate(
                ['user_id' => $user->id, 'title' => $leadData['title']],
                array_merge($leadData, ['user_id' => $user->id])
            );
        }

        // ── Proposals ─────────────────────────────────────────
        $proposalsData = [
            [
                'client_id' => $clients[0]->id,
                'lead_id' => $leads[0]->id,
                'title' => 'Brand Evolution & Digital Ecosystem 2024',
                'status' => ProposalStatus::Sent,
                'currency' => 'EUR',
                'valid_until' => now()->addDays(14)->toDateString(),
                'token' => Str::uuid(),
                'content' => [
                    [
                        'type' => 'paragraph',
                        'content' => [[
                            'type' => 'text',
                            'text' => 'The primary objective of this project is to redefine the visual identity for Vanguard Logistics GmbH, ensuring it aligns with current market aesthetics while maintaining brand heritage.',
                        ]],
                    ],
                    [
                        'type' => 'pricing_item',
                        'attrs' => [
                            'description' => 'Strategic Discovery',
                            'quantity' => 1,
                            'unit_price_cents' => 350000,
                        ],
                    ],
                    [
                        'type' => 'pricing_item',
                        'attrs' => [
                            'description' => 'Visual Identity System',
                            'quantity' => 1,
                            'unit_price_cents' => 825000,
                        ],
                    ],
                ],
                'total_cents' => 1175000,
            ],
            [
                'client_id' => $clients[1]->id,
                'lead_id' => $leads[1]->id,
                'title' => 'SaaS Platform UX Audit & Redesign',
                'status' => ProposalStatus::Draft,
                'currency' => 'EUR',
                'valid_until' => now()->addDays(30)->toDateString(),
                'token' => Str::uuid(),
                'content' => [
                    [
                        'type' => 'pricing_item',
                        'attrs' => [
                            'description' => 'UX Audit & Research',
                            'quantity' => 1,
                            'unit_price_cents' => 200000,
                        ],
                    ],
                    [
                        'type' => 'pricing_item',
                        'attrs' => [
                            'description' => 'UI Redesign — 10 screens',
                            'quantity' => 10,
                            'unit_price_cents' => 25000,
                        ],
                    ],
                ],
                'total_cents' => 450000,
            ],
        ];

        foreach ($proposalsData as $proposalData) {
            Proposal::firstOrCreate(
                ['user_id' => $user->id, 'title' => $proposalData['title']],
                array_merge($proposalData, ['user_id' => $user->id])
            );
        }

        $this->command->info('✓ Freelancer: freelancer@test.com / password');
        $this->command->info('✓ 4 clients seeded (Berlin, München, Hamburg, Düsseldorf)');
        $this->command->info('✓ 5 leads seeded across all pipeline stages');
        $this->command->info('✓ 2 proposals seeded (1 Sent, 1 Draft)');
        $this->command->info('Indexing data into Typesense...');

        \Artisan::call('scout:import', ['model' => 'App\\Models\\Lead']);
        \Artisan::call('scout:import', ['model' => 'App\\Models\\Proposal']);
        \Artisan::call('scout:import', ['model' => 'App\\Models\\Invoice']);
        \Artisan::call('scout:import', ['model' => 'App\\Models\\Client']);
        \Artisan::call('scout:import', ['model' => 'App\\Models\\Contract']);

        $this->command->info('✓ Typesense indexing complete');
    }
}
