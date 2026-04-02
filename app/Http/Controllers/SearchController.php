<?php

namespace App\Http\Controllers;

use App\Enums\ContractStatus;
use App\Models\Client;
use App\Models\Contract;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Proposal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = $request->validate(['q' => ['required', 'string', 'min:1']])['q'];
        $userId = $request->user()->id;

        $results = collect();

        // Search each model and filter by user_id
        $leads = Lead::search($query)
            ->where('user_id', $userId)
            ->take(3)->get()
            ->map(fn ($l) => [
                'type' => 'lead',
                'id' => $l->id,
                'title' => $l->title,
                'subtitle' => $l->status->label(),
                'url' => '/leads',
                'color' => 'blue',
            ]);

        $proposals = Proposal::search($query)
            ->where('user_id', $userId)
            ->take(3)->get()
            ->map(fn ($p) => [
                'type' => 'proposal',
                'id' => $p->id,
                'title' => $p->title,
                'subtitle' => $p->status->label(),
                'url' => "/proposals/{$p->id}/edit",
                'color' => 'violet',
            ]);

        $invoices = Invoice::search($query)
            ->where('user_id', $userId)
            ->take(3)->get()
            ->map(fn ($i) => [
                'type' => 'invoice',
                'id' => $i->id,
                'title' => $i->number,
                'subtitle' => $i->status->label(),
                'url' => $this->invoiceSearchUrl($i),
                'color' => 'green',
            ]);

        $clients = Client::search($query)
            ->where('user_id', $userId)
            ->take(3)->get()
            ->map(fn ($c) => [
                'type' => 'client',
                'id' => $c->id,
                'title' => $c->company_name ?? $c->contact_name,
                'subtitle' => $c->email,
                'url' => "/clients/{$c->id}",
                'color' => 'amber',
            ]);

        $contracts = Contract::search($query)
            ->where('user_id', $userId)
            ->take(3)->get()
            ->map(fn ($c) => [
                'type' => 'contract',
                'id' => $c->id,
                'title' => $c->title,
                'subtitle' => $c->status->label(),
                'url' => $this->contractSearchUrl($c),
                'color' => 'orange',
            ]);

        return response()->json([
            'results' => $leads
                ->concat($proposals)
                ->concat($invoices)
                ->concat($clients)
                ->concat($contracts)
                ->values(),
        ]);
    }

    private function invoiceSearchUrl(Invoice $invoice): string
    {
        return $invoice->status->isTerminal()
            ? '/invoices'
            : "/invoices/{$invoice->id}/edit";
    }

    private function contractSearchUrl(Contract $contract): string
    {
        return in_array($contract->status, [ContractStatus::Signed, ContractStatus::Rejected], strict: true)
            ? '/contracts'
            : "/contracts/{$contract->id}/edit";
    }
}
