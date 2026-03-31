<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Contract;
use App\Services\ContractService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ContractController extends Controller
{
    public function __construct(private ContractService $service) {}

    public function index(Request $request): Response
    {
        $contracts = Contract::where('user_id', $request->user()->id)
            ->with('client:id,contact_name,company_name')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Contracts/Index', compact('contracts'));
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Contracts/Create', [
            'clients' => Client::where('user_id', $request->user()->id)
                ->select('id', 'contact_name', 'company_name')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'proposal_id' => ['nullable', 'integer', 'exists:proposals,id'],
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        $contract = Contract::create([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('contracts.index', $contract)
            ->with('success', 'Contract created.');
    }

    public function edit(Request $request, Contract $contract): Response
    {
        Gate::authorize('update', $contract);

        return Inertia::render('Contracts/Edit', [
            'contract' => $contract->load('client:id,contact_name,company_name'),
            'clients' => Client::where('user_id', $request->user()->id)
                ->select('id', 'contact_name', 'company_name')
                ->get(),
        ]);
    }

    public function update(Request $request, Contract $contract): RedirectResponse
    {
        Gate::authorize('update', $contract);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'client_id' => ['required', 'integer', 'exists:clients,id'],
        ]);

        $contract->update($data);

        return back()->with('success', 'Contract saved.');
    }

    public function send(Contract $contract): RedirectResponse
    {
        Gate::authorize('update', $contract);
        $this->service->send($contract);

        return back()->with('success', 'Contract sent to client.');
    }

    public function destroy(Contract $contract): RedirectResponse
    {
        Gate::authorize('delete', $contract);
        $contract->delete();

        return redirect()->route('contracts.index')
            ->with('success', 'Contract deleted.');
    }

    // ── Public signing routes (no auth) ──────────────────────

    public function sign(string $token): Response
    {
        $contract = Contract::where('token', $token)
            ->with(['client', 'user'])
            ->firstOrFail();

        return Inertia::render('Contracts/Sign', compact('contract'));
    }

    public function submitSignature(Request $request, string $token): RedirectResponse
    {
        $contract = Contract::where('token', $token)->firstOrFail();

        $data = $request->validate([
            'action' => ['required', 'in:sign,reject'],
            'signature' => ['required_if:action,sign', 'string'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        if ($data['action'] === 'sign') {
            $this->service->sign($contract, $data['signature'], $request);
        } else {
            $this->service->reject($contract, $data['reason'] ?? null, $request);
        }

        return back()->with(
            'success',
            $data['action'] === 'sign'
                ? 'Contract signed successfully.'
                : 'Contract rejected.'
        );
    }
}
