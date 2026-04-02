<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(Request $request): Response
    {
        $clients = Client::where('user_id', $request->user()->id)
            ->withCount(['leads', 'proposals', 'invoices', 'contracts'])
            ->orderBy('company_name')
            ->get();

        return Inertia::render('Clients/Index', compact('clients'));
    }

    public function create(): Response
    {
        return Inertia::render('Clients/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'contact_name' => ['required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:2'],
            'vat_number' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $request->user()->clients()->create($data);

        return redirect()->route('clients.index')
            ->with('success', 'Client created.');
    }

    public function show(Request $request, Client $client): Response
    {
        $this->authorizeClient($request, $client);

        $client->load([
            'leads',
            'proposals',
            'contracts',
            'invoices',
        ]);

        return Inertia::render('Clients/Show', compact('client'));
    }

    public function edit(Request $request, Client $client): Response
    {
        $this->authorizeClient($request, $client);

        return Inertia::render('Clients/Edit', compact('client'));
    }

    public function update(Request $request, Client $client): RedirectResponse
    {
        $this->authorizeClient($request, $client);

        $data = $request->validate([
            'contact_name' => ['required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:2'],
            'vat_number' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $client->update($data);

        return redirect()->route('clients.show', $client)
            ->with('success', 'Client updated.');
    }

    public function destroy(Request $request, Client $client): RedirectResponse
    {
        $this->authorizeClient($request, $client);
        $client->delete();

        return redirect()->route('clients.index')
            ->with('success', 'Client deleted.');
    }

    private function authorizeClient(Request $request, Client $client): void
    {
        if ($client->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
