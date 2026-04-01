<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\MagicLinkService;

class MagicLinkController extends Controller
{
    public function __construct(private MagicLinkService $magicLinkService) {}

    // Called by the freelancer from the client detail page
    public function send(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate(['client_id' => ['required', 'exists:clients,id']]);

        $client = \App\Models\Client::findOrFail($request->client_id);

        // Ensure this client belongs to the authenticated freelancer
        abort_if($client->user_id !== auth()->id(), 403);
        abort_if(! $client->portal_enabled, 422, 'Portal access is disabled for this client.');

        $this->magicLinkService->sendLink($client);

        return response()->json(['message' => 'Portal link sent.']);
    }

    // The link the client clicks from their email
    public function authenticate(Request $request, string $token): \Illuminate\Http\RedirectResponse
    {
        $client = $this->magicLinkService->authenticate($token, $request->ip());

        if (! $client) {
            return redirect()->route('portal.session-expired')
                ->with('error', 'This link has expired or already been used.');
        }

        auth('client')->login($client);
        session()->regenerate();

        $intended = session()->pull('portal.intended', route('portal.dashboard'));

        return redirect($intended);
    }

    public function logout(): \Illuminate\Http\RedirectResponse
    {
        auth('client')->logout();
        session()->invalidate();
        session()->regenerateToken();

        return redirect()->route('portal.session-expired');
    }
}
