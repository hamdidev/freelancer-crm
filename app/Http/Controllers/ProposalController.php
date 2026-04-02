<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Proposal;
use App\Services\ProposalService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProposalController extends Controller
{
    public function __construct(private ProposalService $service) {}

    public function index(Request $request): Response
    {
        $proposals = Proposal::where('user_id', $request->user()->id)
            ->with('client:id,contact_name,company_name')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Proposals/Index', [
            'proposals' => $proposals,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Proposals/Create', [
            'clients' => Client::where('user_id', $request->user()->id)
                ->select('id', 'contact_name', 'company_name')
                ->get(),
            'prefill' => $request->only('lead_id', 'client_id', 'title'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'client_id' => [
                'required',
                'integer',
                Rule::exists('clients', 'id')->where('user_id', $request->user()->id),
            ],
            'lead_id' => [
                'nullable',
                'integer',
                Rule::exists('leads', 'id')->where('user_id', $request->user()->id),
            ],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'array'],
            'valid_until' => ['nullable', 'date', 'after:today'],
            'currency' => ['nullable', 'string', 'size:3'],
        ]);

        $content = $data['content'] ?? [];
        $totalCents = $this->service->calculateTotal($content);

        $proposal = $request->user()->proposals()->create([
            ...$data,
            'content' => $content,
            'total_cents' => $totalCents,
            'currency' => $data['currency'] ?? $request->user()->currency,
        ]);

        return redirect()->route('proposals.edit', $proposal)
            ->with('success', 'Proposal created.');
    }

    public function edit(Request $request, Proposal $proposal): Response
    {
        $this->authorize('update', $proposal);

        return Inertia::render('Proposals/Edit', [
            'proposal' => $proposal->load('client:id,contact_name,company_name'),
            'clients' => Client::where('user_id', $request->user()->id)
                ->select('id', 'contact_name', 'company_name')
                ->get(),
        ]);
    }

    public function update(Request $request, Proposal $proposal): RedirectResponse
    {
        $this->authorize('update', $proposal);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'array'],
            'valid_until' => ['nullable', 'date'],
            'client_id' => [
                'required',
                'integer',
                Rule::exists('clients', 'id')->where('user_id', $request->user()->id),
            ],
        ]);

        $content = $data['content'] ?? [];
        $totalCents = $this->service->calculateTotal($content);

        $proposal->update([
            ...$data,
            'content' => $content,
            'total_cents' => $totalCents,
        ]);

        return back()->with('success', 'Proposal saved.');
    }

    public function send(Request $request, Proposal $proposal): RedirectResponse
    {
        $this->authorize('update', $proposal);
        $this->service->send($proposal);

        return back()->with('success', 'Proposal sent to client.');
    }

    public function destroy(Proposal $proposal): RedirectResponse
    {
        $this->authorize('delete', $proposal);
        $proposal->delete();

        return redirect()->route('proposals.index')
            ->with('success', 'Proposal deleted.');
    }

    // ── Public routes (no auth) ──────────────────────────────

    public function view(string $token): Response
    {
        $proposal = Proposal::where('token', $token)
            ->with(['client', 'user'])
            ->firstOrFail();

        // Record first view
        $this->service->recordView($proposal);

        return Inertia::render('Proposals/PublicView', [
            'proposal' => $proposal,
        ]);
    }

    public function clientAction(Request $request, string $token): RedirectResponse
    {
        $proposal = Proposal::where('token', $token)->firstOrFail();

        $data = $request->validate([
            'action' => ['required', 'in:accept,decline'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        match ($data['action']) {
            'accept' => $this->service->accept($proposal, $data['note'] ?? null),
            'decline' => $this->service->decline($proposal, $data['note'] ?? null),
        };

        return back()->with(
            'success',
            $data['action'] === 'accept'
                ? 'Proposal accepted. The freelancer will be in touch shortly.'
                : 'Proposal declined.'
        );
    }
}
