<?php

namespace App\Http\Controllers;

use App\Enums\LeadStatus;
use App\Models\Lead;
use App\StateMachines\LeadStateMachine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function index(Request $request): Response
    {
        $leads = Lead::forUser($request->user()->id)
            ->with('client:id,contact_name,company_name')
            ->orderBy('position')
            ->get()
            ->groupBy(fn(Lead $lead) => $lead->status->value);

        return Inertia::render('Leads/Index', [
            'leadsByStatus' => $leads,
            'statuses'      => LeadStatus::pipelineColumns(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'source'         => ['nullable', 'string', 'max:100'],
            'value_estimate' => ['nullable', 'integer', 'min:0'],
            'notes'          => ['nullable', 'string'],
            'status'         => ['nullable', 'string'],
        ]);

        $request->user()->leads()->create([
            ...$data,
            'status'   => $data['status'] ?? LeadStatus::New->value,
            'position' => Lead::forUser($request->user()->id)->max('position') + 1,
        ]);

        return redirect()->route('leads.index')
            ->with('success', 'Lead created.');
    }

    public function update(Request $request, Lead $lead): RedirectResponse
    {
        $this->authorize('update', $lead);

        $data = $request->validate([
            'title'          => ['sometimes', 'string', 'max:255'],
            'source'         => ['nullable', 'string', 'max:100'],
            'value_estimate' => ['nullable', 'integer', 'min:0'],
            'notes'          => ['nullable', 'string'],
        ]);

        $lead->update($data);

        return back()->with('success', 'Lead updated.');
    }

    public function updateStatus(Request $request, Lead $lead): RedirectResponse
    {
        $this->authorize('update', $lead);

        $data = $request->validate([
            'status'   => ['required', 'string'],
            'position' => ['nullable', 'integer'],
        ]);

        $newStatus = LeadStatus::from($data['status']);
        $machine   = new LeadStateMachine($lead->status);
        $machine->transitionTo($newStatus); // throws ValidationException on illegal transition

        $timestamps = match ($newStatus) {
            LeadStatus::Won  => ['won_at'  => now()],
            LeadStatus::Lost => ['lost_at' => now()],
            default          => [],
        };

        $lead->update([
            'status'   => $newStatus,
            'position' => $data['position'] ?? $lead->position,
            ...$timestamps,
        ]);

        return back()->with('success', 'Lead status updated.');
    }

    public function destroy(Lead $lead): RedirectResponse
    {
        $this->authorize('delete', $lead);
        $lead->delete();

        return redirect()->route('leads.index')
            ->with('success', 'Lead deleted.');
    }
}
