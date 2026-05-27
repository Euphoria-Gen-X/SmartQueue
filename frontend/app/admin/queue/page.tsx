"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import AdminShell from "../../components/AdminShell";
import RequireRole from "../../components/RequireRole";
import StatusMessage from "../../components/StatusMessage";
import { useToast } from "../../components/Toast";

type QueueItem = {
  _id: string;
  currentPosition: number;
  status: string;
  estimatedWait: number;
  tokenNumber: number;
  appointmentId?: { userId?: { name: string } };
};

export default function AdminQueuePage() {
  const { showToast } = useToast();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    apiRequest<QueueItem[]>("/admin/queue")
      .then(setQueue)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load queue"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const interval = window.setInterval(load, 12000);
    return () => window.clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiRequest(`/admin/queue/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      showToast(`Queue updated: ${status}`, "success");
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    }
  };

  return (
    <RequireRole role="admin" redirectTo="/admin/login">
      <AdminShell>
        <h1 className="text-2xl font-bold">Queue Monitoring</h1>
        <p className="mt-1 text-sm text-slate-600">Auto-refreshes every 12 seconds.</p>
        <div className="mt-6 space-y-3">
          <StatusMessage error={error} />
          {loading ? <p className="text-slate-600">Loading active queue...</p> : null}
          {queue.map((item) => (
            <article key={item._id} className="rounded-md border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    Token {item.tokenNumber} | Position {item.currentPosition} | {item.status}
                  </p>
                  <p className="text-sm text-slate-600">
                    {item.appointmentId?.userId?.name || "Customer"} | Wait {item.estimatedWait} min
                  </p>
                </div>
                <div className="flex gap-2">
                  {["serving", "served", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(item._id, status)}
                      className="rounded-md border px-3 py-1.5 capitalize"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
          {!queue.length && !error && !loading ? <p className="text-slate-600">No checked-in customers are waiting.</p> : null}
        </div>
      </AdminShell>
    </RequireRole>
  );
}
