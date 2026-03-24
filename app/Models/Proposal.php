<?php

namespace App\Models;

use App\Enums\ProposalStatus;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Proposal extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'user_id',
        'client_id',
        'lead_id',
        'title',
        'content',
        'status',
        'total_cents',
        'currency',
        'valid_until',
        'token',
        'viewed_at',
        'accepted_at',
        'declined_at',
        'client_note',
        'pdf_path',
    ];

    protected function casts(): array
    {
        return [
            'content'     => 'array',
            'status'      => ProposalStatus::class,
            'total_cents' => 'integer',
            'valid_until' => 'date',
            'viewed_at'   => 'datetime',
            'accepted_at' => 'datetime',
            'declined_at' => 'datetime',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnly(['status', 'title']);
    }

    // Auto-generate UUID token on creation
    protected static function booted(): void
    {
        static::creating(function (Proposal $proposal) {
            $proposal->token ??= (string) Str::uuid();
        });
    }

    public function isExpired(): bool
    {
        return $this->valid_until && $this->valid_until->isPast()
            && $this->status === ProposalStatus::Sent;
    }

    // Formatted total for display
    public function formattedTotal(): string
    {
        return number_format($this->total_cents / 100, 2, ',', '.') . ' ' . $this->currency;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }
}
