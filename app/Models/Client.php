<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Scout\Searchable;

class Client extends Authenticatable
{
    use HasFactory, Searchable, SoftDeletes;

    protected $fillable = [
        'user_id',
        'company_name',
        'contact_name',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'vat_number',
        'portal_password',
        'notes',
        'portal_enabled',
        'last_portal_access_at',
    ];

    public function toSearchableArray(): array
    {
        return [
            'id' => (string) $this->id,
            'contact_name' => $this->contact_name,
            'company_name' => $this->company_name ?? '',
            'email' => $this->email,
            'user_id' => $this->user_id,
            'created_at_timestamp' => $this->created_at->timestamp,
        ];
    }

    protected $hidden = ['portal_password'];

    protected function casts(): array
    {
        return [
            'portal_password' => 'hashed',
            'portal_enabled' => 'boolean',
            'last_portal_access_at' => 'datetime',
        ];
    }

    // Client auth uses portal_password mapped as "password"
    public function getAuthPassword(): string
    {
        return $this->portal_password ?? '';
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->company_name ?? $this->contact_name;
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function portalTokens(): HasMany
    {
        return $this->hasMany(ClientPortalToken::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public function proposals(): HasMany
    {
        return $this->hasMany(Proposal::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
