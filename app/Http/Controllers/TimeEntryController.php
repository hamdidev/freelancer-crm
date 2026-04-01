<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TimeEntry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TimeEntryController extends Controller
{
    public function index(Request $request): Response
    {
        $entries = TimeEntry::forUser($request->user()->id)
            ->with('project:id,name')
            ->orderByDesc('started_at')
            ->get();

        // Group by date for display
        $grouped = $entries->groupBy(
            fn($e) =>
            $e->started_at->format('Y-m-d')
        );

        // Check if there's a running timer
        $running = TimeEntry::forUser($request->user()->id)
            ->whereNull('ended_at')
            ->latest('started_at')
            ->first();

        $projects = Project::where('user_id', $request->user()->id)
            ->select('id', 'name')
            ->get();

        $stats = [
            'today_seconds'   => $entries->filter(
                fn($e) =>
                $e->started_at->isToday()
            )->sum('duration_seconds'),
            'week_seconds'    => $entries->filter(
                fn($e) =>
                $e->started_at->isCurrentWeek()
            )->sum('duration_seconds'),
            'billable_uninvoiced' => $entries
                ->where('billable', true)
                ->whereNull('invoiced_at')
                ->sum('duration_seconds'),
        ];

        return Inertia::render('Time/Index', [
            'grouped'  => $grouped,
            'running'  => $running,
            'projects' => $projects,
            'stats'    => $stats,
        ]);
    }

    /**
     * Start a new timer.
     */
    public function start(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'description' => ['nullable', 'string', 'max:255'],
            'project_id'  => ['nullable', 'integer', 'exists:projects,id'],
            'billable'    => ['nullable', 'boolean'],
        ]);

        // Stop any currently running timer
        TimeEntry::forUser($request->user()->id)
            ->whereNull('ended_at')
            ->each(fn($e) => $e->forceStop());

        TimeEntry::create([
            'user_id'     => $request->user()->id,
            'description' => $data['description'] ?? null,
            'project_id'  => $data['project_id']  ?? null,
            'billable'    => $data['billable']     ?? true,
            'started_at'  => now(),
        ]);

        return back()->with('success', 'Timer started.');
    }

    /**
     * Stop the running timer.
     */
    public function stop(Request $request, TimeEntry $entry): RedirectResponse
    {
        if ($entry->user_id !== $request->user()->id) {
            abort(403);
        }

        $entry->update([
            'ended_at'         => now(),
            'duration_seconds' => now()->diffInSeconds($entry->started_at),
        ]);

        return back()->with('success', 'Timer stopped.');
    }

    /**
     * Update a time entry (description, billable, project).
     */
    public function update(Request $request, TimeEntry $entry): RedirectResponse
    {
        if ($entry->user_id !== $request->user()->id) {
            abort(403);
        }

        $data = $request->validate([
            'description' => ['nullable', 'string', 'max:255'],
            'project_id'  => ['nullable', 'integer'],
            'billable'    => ['nullable', 'boolean'],
        ]);

        $entry->update($data);

        return back()->with('success', 'Entry updated.');
    }

    /**
     * Sync timer duration from frontend (called every 60s).
     */
    public function sync(Request $request, TimeEntry $entry): \Illuminate\Http\JsonResponse
    {
        if ($entry->user_id !== $request->user()->id) {
            abort(403);
        }

        $entry->update([
            'duration_seconds' => now()->diffInSeconds($entry->started_at),
        ]);

        return response()->json(['ok' => true]);
    }

    public function destroy(Request $request, TimeEntry $entry): RedirectResponse
    {
        if ($entry->user_id !== $request->user()->id) {
            abort(403);
        }

        $entry->delete();

        return back()->with('success', 'Entry deleted.');
    }
}
