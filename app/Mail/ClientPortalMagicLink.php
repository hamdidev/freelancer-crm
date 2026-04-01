<?php

namespace App\Mail;

use App\Models\Client;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ClientPortalMagicLink extends Mailable
{
    public string $portalUrl;

    public function __construct(
        public readonly Client $client,
        string $rawToken,
    ) {
        $this->portalUrl = route('portal.authenticate', ['token' => $rawToken]);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Secure Portal Link',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.portal.magic-link',
        );
    }
}
