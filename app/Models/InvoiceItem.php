<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id',
        'description',
        'quantity',
        'unit_price_cents',
        'total_cents',
        'position',
        'time_entry_ids',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'float',
            'unit_price_cents' => 'integer',
            'total_cents' => 'integer',
            'time_entry_ids' => 'array',
        ];
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
