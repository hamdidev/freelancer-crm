<?php

namespace App\Models;

use App\Enums\InvoiceStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Invoice extends Model
{
    use HasFactory, LogsActivity, Searchable, SoftDeletes;

    protected $fillable = [
        'user_id',
        'client_id',
        'project_id',
        'number',
        'status',
        'currency',
        'subtotal_cents',
        'tax_rate',
        'tax_cents',
        'total_cents',
        'issue_date',
        'due_at',
        'service_date',
        'paid_at',
        'viewed_at',
        'stripe_payment_intent_id',
        'notes',
        'recurring',
        'recurring_interval',
    ];

    public function toSearchableArray(): array
    {
        return [
            'id' => (string) $this->id,
            'number' => $this->number,
            'status' => $this->status->value,
            'user_id' => $this->user_id,
            'created_at_timestamp' => $this->created_at->timestamp,
        ];
    }

    protected function casts(): array
    {
        return [
            'status' => InvoiceStatus::class,
            'subtotal_cents' => 'integer',
            'tax_cents' => 'integer',
            'total_cents' => 'integer',
            'tax_rate' => 'decimal:2',
            'issue_date' => 'date',
            'due_at' => 'date',
            'service_date' => 'date',
            'paid_at' => 'datetime',
            'viewed_at' => 'datetime',
            'recurring' => 'boolean',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnly(['status', 'number', 'total_cents']);
    }

    public function isOverdue(): bool
    {
        return $this->status->isUnpaid() && $this->due_at->isPast();
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class)->orderBy('position');
    }
}
