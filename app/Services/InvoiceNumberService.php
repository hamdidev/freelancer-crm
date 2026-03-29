<?php

namespace App\Services;

use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

class InvoiceNumberService
{
    /**
     * Generate the next sequential invoice number for a user.
     * Format: INV-{YEAR}-{SEQUENCE}
     * e.g. INV-2026-0001, INV-2026-0002 ...
     *
     * Locks the user row to prevent duplicate numbers
     * in case of concurrent requests (GoBD compliant).
     */
    public function generate(int $userId): string
    {
        return DB::transaction(function () use ($userId) {
            $year = now()->year;

            // Lock the user row to prevent race conditions
            // without using lockForUpdate on an aggregate query
            DB::table('users')
                ->where('id', $userId)
                ->lockForUpdate()
                ->first();

            // Count all invoices for this user this year
            // including soft-deleted ones (GoBD requires no gaps)
            $count = Invoice::withTrashed()
                ->where('user_id', $userId)
                ->whereYear('created_at', $year)
                ->count();

            $sequence = str_pad($count + 1, 4, '0', STR_PAD_LEFT);

            return "INV-{$year}-{$sequence}";
        });
    }
}
