<?php

namespace App\Enums;

enum InvoiceStatus: string
{
    case Draft = 'draft';
    case Sent = 'sent';
    case Viewed = 'viewed';
    case Partial = 'partial';
    case Paid = 'paid';
    case Overdue = 'overdue';
    case Void = 'void';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Sent => 'Sent',
            self::Viewed => 'Viewed',
            self::Partial => 'Partial',
            self::Paid => 'Paid',
            self::Overdue => 'Overdue',
            self::Void => 'Void',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'gray',
            self::Sent => 'blue',
            self::Viewed => 'violet',
            self::Partial => 'amber',
            self::Paid => 'green',
            self::Overdue => 'red',
            self::Void => 'slate',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Paid, self::Void]);
    }

    public function isUnpaid(): bool
    {
        return in_array($this, [self::Sent, self::Viewed, self::Partial, self::Overdue]);
    }
}
