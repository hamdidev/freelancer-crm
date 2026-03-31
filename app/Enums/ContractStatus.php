<?php

namespace App\Enums;

enum ContractStatus: string
{
    case Draft = 'draft';
    case Sent = 'sent';
    case Signed = 'signed';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Sent => 'Sent',
            self::Signed => 'Signed',
            self::Rejected => 'Rejected',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'gray',
            self::Sent => 'blue',
            self::Signed => 'green',
            self::Rejected => 'red',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Signed, self::Rejected]);
    }
}
