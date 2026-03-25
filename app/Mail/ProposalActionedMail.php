<?php

namespace App\Mail;

use App\Models\Proposal;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProposalActionedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Proposal $proposal,
        public string   $action  // 'accepted' | 'declined'
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->action === 'accepted'
            ? "✓ Proposal Accepted: {$this->proposal->title}"
            : "✗ Proposal Declined: {$this->proposal->title}";

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.proposal-actioned');
    }
}
