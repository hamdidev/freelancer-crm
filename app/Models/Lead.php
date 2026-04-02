<?php

namespace App\Models;

use App\Enums\LeadStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Lead extends Model
{
    use HasFactory, LogsActivity, Searchable, SoftDeletes;

    protected $fillable = [
        'user_id',
        'client_id',
        'title',
        'status',
        'source',
        'value_estimate',
        'position',
        'notes',
        'won_at',
        'lost_at',
    ];

    public function toSearchableArray(): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'status' => $this->status->value,
            'source' => $this->source ?? '',
            'notes' => $this->notes ?? '',
            'user_id' => $this->user_id,
            'created_at_timestamp' => $this->created_at->timestamp,
        ];
    }

    protected function casts(): array
    {
        return [
            'status' => LeadStatus::class,
            'value_estimate' => 'integer',
            'position' => 'integer',
            'won_at' => 'datetime',
            'lost_at' => 'datetime',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnly(['status', 'title']);
    }

    // Scoped to logged-in freelancer
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
}
