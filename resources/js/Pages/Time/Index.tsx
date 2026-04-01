import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { type TimeEntry, type TimeStats } from "@/types";
import { useTimer, formatSeconds } from "@/hooks/useTimer";
import { Play, Square, Trash2, Clock } from "lucide-react";

interface Project {
    id: number;
    name: string;
}

interface Props {
    grouped: Record<string, TimeEntry[]>;
    running: TimeEntry | null;
    projects: Project[];
    stats: TimeStats;
}

export default function TimeIndex({
    grouped,
    running,
    projects,
    stats,
}: Props) {
    const elapsed = useTimer(running);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        description: "",
        project_id: "",
        billable: true,
    });

    function startTimer(e: React.FormEvent) {
        e.preventDefault();
        post("/time/start", {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    }

    function stopTimer() {
        if (!running) return;
        router.patch(`/time/${running.id}/stop`, {}, { preserveScroll: true });
    }

    function deleteEntry(id: number) {
        if (!confirm("Delete this time entry?")) return;
        router.delete(`/time/${id}`, { preserveScroll: true });
    }

    const totalDays = Object.keys(grouped).length;

    return (
        <AppLayout title="Time Tracking">
            <Head title="Time" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">Today</p>
                    <p className="text-2xl font-bold text-primary font-mono">
                        {formatSeconds(stats.today_seconds)}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">This Week</p>
                    <p className="text-2xl font-bold text-primary font-mono">
                        {formatSeconds(stats.week_seconds)}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">
                        Uninvoiced Billable
                    </p>
                    <p className="text-2xl font-bold text-amber-600 font-mono">
                        {formatSeconds(stats.billable_uninvoiced)}
                    </p>
                </div>
            </div>

            {/* Timer widget */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                {running ? (
                    /* Running timer */
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            <div>
                                <p className="text-3xl font-bold font-mono text-primary">
                                    {formatSeconds(elapsed)}
                                </p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {running.description ?? "No description"}
                                    {running.project && (
                                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                            {running.project.name}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={stopTimer}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            <Square size={16} />
                            Stop
                        </button>
                    </div>
                ) : (
                    /* Start timer */
                    <div>
                        {!showForm ? (
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                            >
                                <Play size={16} />
                                Start Timer
                            </button>
                        ) : (
                            <form
                                onSubmit={startTimer}
                                className="flex items-center gap-4"
                            >
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="What are you working on?"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    autoFocus
                                />
                                <select
                                    value={data.project_id}
                                    onChange={(e) =>
                                        setData("project_id", e.target.value)
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                >
                                    <option value="">No project</option>
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.billable}
                                        onChange={(e) =>
                                            setData(
                                                "billable",
                                                e.target.checked,
                                            )
                                        }
                                        className="rounded"
                                    />
                                    Billable
                                </label>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                                >
                                    <Play size={16} />
                                    Start
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>

            {/* Time entries grouped by date */}
            {totalDays === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 text-center">
                    <Clock size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">
                        No time entries yet.
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                        Start a timer to track your work.
                    </p>
                </div>
            )}

            <div className="space-y-6">
                {Object.entries(grouped).map(([date, entries]) => {
                    const dayTotal = entries.reduce(
                        (sum, e) => sum + e.duration_seconds,
                        0,
                    );

                    return (
                        <div
                            key={date}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                        >
                            {/* Day header */}
                            <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-100">
                                <span className="text-sm font-semibold text-gray-700">
                                    {new Date(date).toLocaleDateString(
                                        "de-DE",
                                        {
                                            weekday: "long",
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        },
                                    )}
                                </span>
                                <span className="text-sm font-mono font-bold text-primary">
                                    {formatSeconds(dayTotal)}
                                </span>
                            </div>

                            {/* Entries */}
                            {entries.map((entry, i) => (
                                <div
                                    key={entry.id}
                                    className={`flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors ${
                                        i < entries.length - 1
                                            ? "border-b border-gray-50"
                                            : ""
                                    }`}
                                >
                                    {/* Billable dot */}
                                    <div
                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                            entry.billable
                                                ? "bg-green-400"
                                                : "bg-gray-300"
                                        }`}
                                        title={
                                            entry.billable
                                                ? "Billable"
                                                : "Non-billable"
                                        }
                                    />

                                    {/* Description */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800">
                                            {entry.description ?? (
                                                <span className="text-gray-400 italic">
                                                    No description
                                                </span>
                                            )}
                                        </p>
                                        {entry.project && (
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                {entry.project.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Time range */}
                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                        {new Date(
                                            entry.started_at,
                                        ).toLocaleTimeString("de-DE", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        {entry.ended_at && (
                                            <>
                                                {" – "}
                                                {new Date(
                                                    entry.ended_at,
                                                ).toLocaleTimeString("de-DE", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </>
                                        )}
                                    </span>

                                    {/* Duration */}
                                    <span className="text-sm font-mono font-bold text-gray-700 w-20 text-right flex-shrink-0">
                                        {entry.ended_at ? (
                                            formatSeconds(
                                                entry.duration_seconds,
                                            )
                                        ) : (
                                            <span className="text-green-500 animate-pulse">
                                                Running
                                            </span>
                                        )}
                                    </span>

                                    {/* Invoiced badge */}
                                    {entry.invoiced_at && (
                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">
                                            Invoiced
                                        </span>
                                    )}

                                    {/* Delete */}
                                    {!entry.invoiced_at && (
                                        <button
                                            onClick={() =>
                                                deleteEntry(entry.id)
                                            }
                                            className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}
