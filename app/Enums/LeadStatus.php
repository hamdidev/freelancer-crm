<?php

namespace App\Enums;

enum LeadStatus: string
{
    case New         = 'new';
    case Contacted   = 'contacted';
    case ProposalSent = 'proposal_sent';
    case Negotiation = 'negotiation';
    case Won         = 'won';
    case Lost        = 'lost';

    public function label(): string
    {
        return match ($this) {
            self::New          => 'New',
            self::Contacted    => 'Contacted',
            self::ProposalSent => 'Proposal Sent',
            self::Negotiation  => 'Negotiation',
            self::Won          => 'Won',
            self::Lost         => 'Lost',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::New          => 'blue',
            self::Contacted    => 'violet',
            self::ProposalSent => 'amber',
            self::Negotiation  => 'orange',
            self::Won          => 'green',
            self::Lost         => 'red',
        };
    }

    /** Statuses shown as active pipeline columns on the Kanban */
    public static function pipelineColumns(): array
    {
        return [
            self::New,
            self::Contacted,
            self::ProposalSent,
            self::Negotiation,
        ];
    }
}
