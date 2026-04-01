<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientPortalToken extends Model
{
    protected $fillable = [
        'client_id',
        'token',
        'expires_at',
        'used_at',
        'ip_address',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at'    => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function isValid(): bool
    {
        return is_null($this->used_at)
            && $this->expires_at->isFuture();
    }

    public function markUsed(string $ip): void
    {
        $this->update([
            'used_at'    => now(),
            'ip_address' => $ip,
        ]);
    }
}
