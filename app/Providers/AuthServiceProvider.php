<?php

namespace App\Providers;

use App\Models\Lead;
use App\Models\Proposal;
use App\Policies\LeadPolicy;
use App\Policies\ProposalPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Lead::class => LeadPolicy::class,
        Proposal::class => ProposalPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
