<?php

namespace App\Policies;

use App\Enums\ContractStatus;
use App\Models\Contract;
use App\Models\User;

class ContractPolicy
{
    public function update(User $user, Contract $contract): bool
    {
        return $user->id === $contract->user_id
            && ! $contract->status->isTerminal();
    }

    public function delete(User $user, Contract $contract): bool
    {
        return $user->id === $contract->user_id
            && $contract->status === ContractStatus::Draft;
    }
}
