import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { type TimeEntry } from "@/types";

export function useTimer(running: TimeEntry | null) {
    const [elapsed, setElapsed] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!running) {
            setElapsed(0);
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
            return;
        }

        // Calculate elapsed from started_at
        const startTime = new Date(running.started_at).getTime();

        function tick() {
            const now = Date.now();
            const diff = Math.floor((now - startTime) / 1000);
            setElapsed(diff);
        }

        tick(); // immediate first tick
        intervalRef.current = setInterval(tick, 1000);

        // Sync to server every 60 seconds
        syncIntervalRef.current = setInterval(() => {
            router.post(
                `/time/${running.id}/sync`,
                {},
                { preserveScroll: true, preserveState: true },
            );
        }, 60000);

        // Sync on tab close/switch
        function handleVisibilityChange() {
            if (document.visibilityState === "hidden") {
                router.post(
                    `/time/${running.id}/sync`,
                    {},
                    { preserveScroll: true, preserveState: true },
                );
            }
        }
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, [running?.id]);

    return elapsed;
}

export function formatSeconds(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
