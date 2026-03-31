<?php

namespace App\Providers;

use App\Models\Contract;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Proposal;
use App\Observers\LeadObserver;
use App\Policies\ContractPolicy;
use App\Policies\InvoicePolicy;
use App\Policies\LeadPolicy;
use App\Policies\ProposalPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Stripe\StripeClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(
            StripeClient::class,
            fn () => new StripeClient(config('services.stripe.secret'))
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Lead::observe(LeadObserver::class);

        // Policies
        Gate::policy(Lead::class, LeadPolicy::class);
        Gate::policy(Proposal::class, ProposalPolicy::class);
        Gate::policy(Invoice::class, InvoicePolicy::class);
        Gate::policy(Contract::class, ContractPolicy::class);
    }
}
