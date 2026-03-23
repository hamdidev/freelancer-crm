<?php

namespace App\Observers;

use App\Enums\LeadStatus;
use App\Models\Client;
use App\Models\Lead;
use Illuminate\Support\Facades\Log;

class LeadObserver
{
    public function updated(Lead $lead): void
    {
        // When a lead is marked Won, auto-create a Client if one doesn't exist
        if (
            $lead->wasChanged('status') &&
            $lead->status === LeadStatus::Won &&
            is_null($lead->client_id)
        ) {
            $this->createClientFromLead($lead);
        }
    }

    private function createClientFromLead(Lead $lead): void
    {
        $client = Client::create([
            'user_id'      => $lead->user_id,
            'contact_name' => $lead->title, // placeholder — freelancer updates later
            'email'        => '', // required field, freelancer fills in
        ]);

        // Link the client back to the lead
        $lead->updateQuietly(['client_id' => $client->id]);

        Log::info("Client auto-created from Won lead", [
            'lead_id'   => $lead->id,
            'client_id' => $client->id,
        ]);
    }
}
