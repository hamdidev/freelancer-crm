<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimeEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'description',
        'started_at',
        'ended_at',
        'duration_seconds',
        'billable',
        'invoiced_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at'  => 'datetime',
            'ended_at'    => 'datetime',
            'invoiced_at' => 'datetime',
            'billable'    => 'boolean',
        ];
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeBillable($query)
    {
        return $query->where('billable', true);
    }

    public function scopeUninvoiced($query)
    {
        return $query->whereNull('invoiced_at');
    }

    /**
     * Calculate duration in seconds from started_at to ended_at.
     */
    public function calculateDuration(): int
    {
        if (!$this->ended_at) return 0;
        return $this->ended_at->diffInSeconds($this->started_at);
    }

    /**
     * Format duration as HH:MM:SS
     */
    public function formattedDuration(): string
    {
        $seconds = $this->duration_seconds;
        $hours   = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $secs    = $seconds % 60;

        return sprintf('%02d:%02d:%02d', $hours, $minutes, $secs);
    }

    /**
     * Force stop a running timer (called by scheduler).
     */
    public function forceStop(): void
    {
        $this->update([
            'ended_at'         => now(),
            'duration_seconds' => $this->calculateDuration(),
        ]);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
