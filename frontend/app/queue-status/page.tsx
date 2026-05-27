"use client";

import { useEffect, useState } from "react";
import { apiRequest, getSessionUser } from "../../lib/api";
import PageShell from "../components/PageShell";
import RequireRole from "../components/RequireRole";
import StatusMessage from "../components/StatusMessage";

type QueueItem = {
  _id: string;
  currentPosition: number;
  status: string;
  estimatedWait: number;
  tokenNumber: number;
  userId?: string;
  appointmentId?: {
    userId?: { _id: string; name: string };
    serviceId?: { name: string };
  };
};

export default function QueueStatusPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = getSessionUser();

  useEffect(() => {
    const load = () => {
      apiRequest<QueueItem[]>("/customer/queue")
        .then(setQueue)
        .catch((err) => setError(err instanceof Error ? err.message : "Failed to load queue"))
        .finally(() => setLoading(false));
    };
    load();
    const interval = window.setInterval(load, 12000);
    return () => window.clearInterval(interval);
  }, []);

  const myItems = queue.filter(
    (item) =>
      item.appointmentId?.userId?._id === user?.id ||
      String(item.userId) === user?.id
  );

  const display = myItems.length ? myItems : queue;

  return (
    <RequireRole role="customer" redirectTo="/login">
      <PageShell>
        <h1 className="text-2xl font-bold">Queue Status</h1>
        <p className="mt-1 text-sm text-slate-600">Updates every 12 seconds.</p>
        <div className="mt-6 space-y-3">
          <StatusMessage error={error} />
          {loading ? <p className="text-slate-600">Loading queue status...</p> : null}
          {display.map((item) => (
            <article key={item._id} className="rounded-md border bg-white p-4">
              <p className="font-semibold">
                Token {item.tokenNumber} |{" "}
                {item.status === "booked" ? "Check in on arrival" : `Position ${item.currentPosition}`} |{" "}
                {item.status}
              </p>
              <p className="text-sm text-slate-600">
                {item.appointmentId?.serviceId?.name || "Consultation"} | Est. wait{" "}
                {item.estimatedWait} min
              </p>
            </article>
          ))}
          {!display.length && !error && !loading ? <p className="text-slate-600">No queue entries yet.</p> : null}
        </div>
      </PageShell>
    </RequireRole>
  );
}
