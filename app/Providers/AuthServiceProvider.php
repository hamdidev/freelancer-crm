<?php

namespace App\Providers;

use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Proposal;
use App\Policies\InvoicePolicy;
use App\Policies\LeadPolicy;
use App\Policies\ProposalPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Lead::class => LeadPolicy::class,
        Proposal::class => ProposalPolicy::class,
        Invoice::class => InvoicePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
