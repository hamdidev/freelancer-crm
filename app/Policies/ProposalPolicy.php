<?php

namespace App\Policies;

use App\Models\Proposal;
use App\Models\User;

class ProposalPolicy
{
    public function update(User $user, Proposal $proposal): bool
    {
        return $user->id === $proposal->user_id;
    }

    public function delete(User $user, Proposal $proposal): bool
    {
        return $user->id === $proposal->user_id
            && !$proposal->status->isTerminal();
    }
}
