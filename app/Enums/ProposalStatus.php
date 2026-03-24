<?php

namespace App\Enums;

enum ProposalStatus: string
{
    case Draft    = 'draft';
    case Sent     = 'sent';
    case Viewed   = 'viewed';
    case Accepted = 'accepted';
    case Declined = 'declined';
    case Expired  = 'expired';

    public function label(): string
    {
        return match ($this) {
            self::Draft    => 'Draft',
            self::Sent     => 'Sent',
            self::Viewed   => 'Viewed',
            self::Accepted => 'Accepted',
            self::Declined => 'Declined',
            self::Expired  => 'Expired',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft    => 'gray',
            self::Sent     => 'blue',
            self::Viewed   => 'violet',
            self::Accepted => 'green',
            self::Declined => 'red',
            self::Expired  => 'orange',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Accepted, self::Declined, self::Expired]);
    }
}
