<?php

namespace App\Models;

use App\Enums\ContractStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Contract extends Model
{
    use HasFactory, LogsActivity, SoftDeletes;

    protected $fillable = [
        'user_id',
        'client_id',
        'proposal_id',
        'title',
        'body',
        'status',
        'token',
        'sent_at',
        'signed_at',
        'rejected_at',
        'signature_path',
        'signer_ip',
        'signer_user_agent',
        'document_hash',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'status' => ContractStatus::class,
            'sent_at' => 'datetime',
            'signed_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnly(['status', 'title']);
    }

    protected static function booted(): void
    {
        static::creating(function (Contract $contract) {
            $contract->token ??= (string) Str::uuid();
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function proposal(): BelongsTo
    {
        return $this->belongsTo(Proposal::class);
    }
}
