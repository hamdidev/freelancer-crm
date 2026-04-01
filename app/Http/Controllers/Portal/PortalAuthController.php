<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Services\MagicLinkService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalAuthController extends Controller
{
    public function __construct(private MagicLinkService $magicLinkService) {}

    public function showLogin(): Response
    {
        return Inertia::render('Portal/Login');
    }

    public function requestLink(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'user_id' => ['required', 'integer'],
        ]);

        try {
            $this->magicLinkService->sendLinkByEmail($request->email, (int) $request->user_id);
        } catch (\Exception) {
            // Don't reveal if email exists or portal is disabled
        }

        return back()->with('success', 'If that email is registered, you will receive a login link shortly.');
    }
}
