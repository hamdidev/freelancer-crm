<?php

use Illuminate\Support\Facades\Schedule;
use App\Models\TimeEntry;

Schedule::call(function () {
    TimeEntry::whereNull('ended_at')
        ->where('started_at', '<', now()->subHours(12))
        ->each(fn($e) => $e->forceStop());
})->daily()->name('force-stop-abandoned-timers');
