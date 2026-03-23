<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Client extends Authenticatable
{
    use HasFactory, SoftDeletes;

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
    ];

    protected $hidden = ['portal_password'];

    protected function casts(): array
    {
        return ['password' => 'hashed'];
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

    public function loginTokens(): HasMany
    {
        return $this->hasMany(ClientLoginToken::class);
    }
}
