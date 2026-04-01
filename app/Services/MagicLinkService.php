<?php

namespace App\Services;

use App\Mail\ClientPortalMagicLink;
use App\Models\Client;
use App\Models\ClientPortalToken;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class MagicLinkService
{
    private const TTL_HOURS = 24;

    public function sendLinkByEmail(string $email, int $userId): void
    {
        $client = Client::where('user_id', $userId)
            ->where('email', $email)
            ->where('portal_enabled', true)
            ->firstOrFail();

        $this->sendLink($client);
    }

    public function sendLink(Client $client): void
    {
        // Revoke any unused, unexpired tokens for this client first
        ClientPortalToken::where('client_id', $client->id)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->delete();

        $raw = Str::random(64);
        $hash = hash('sha256', $raw);

        ClientPortalToken::create([
            'client_id' => $client->id,
            'token' => $hash,
            'expires_at' => now()->addHours(self::TTL_HOURS),
        ]);

        Mail::to($client->email)
            ->send(new ClientPortalMagicLink($client, $raw));
    }

    public function authenticate(string $rawToken, string $ip): ?Client
    {
        $hash = hash('sha256', $rawToken);
        $token = ClientPortalToken::with('client')
            ->where('token', $hash)
            ->first();

        if (! $token || ! $token->isValid()) {
            return null;
        }

        $token->markUsed($ip);

        $token->client->update(['last_portal_access_at' => now()]);

        return $token->client;
    }
}
