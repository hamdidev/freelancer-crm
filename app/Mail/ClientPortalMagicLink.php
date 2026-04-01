<?php


namespace App\Mail;

use App\Models\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClientPortalMagicLink extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

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
            markdown: 'emails.portal.magic-link',
        );
    }
}
