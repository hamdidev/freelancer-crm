<?php

namespace App\Policies;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    public function update(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id
            && ! $invoice->status->isTerminal();
    }

    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->id === $invoice->user_id
            && $invoice->status === InvoiceStatus::Draft;
    }
}
