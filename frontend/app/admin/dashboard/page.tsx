"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "../../../lib/api";
import AdminShell from "../../components/AdminShell";
import RequireRole from "../../components/RequireRole";
import StatusMessage from "../../components/StatusMessage";

type Summary = {
  users: number;
  appointments: number;
  waitingQueue: number;
  checkedInCustomers: number;
  completedConsultations: number;
  currentToken: number | null;
  nextToken: number | null;
  activeRooms: number;
};

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    apiRequest<Summary>("/admin/dashboard")
      .then(setSummary)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const interval = window.setInterval(load, 15000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <RequireRole role="admin" redirectTo="/admin/login">
      <AdminShell>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <StatusMessage error={error} />
        {loading ? <p className="mt-4 text-sm text-slate-600">Loading dashboard...</p> : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total Users", summary?.users ?? 0],
            ["Appointments", summary?.appointments ?? 0],
            ["Waiting", summary?.waitingQueue ?? 0],
            ["Checked In", summary?.checkedInCustomers ?? 0],
            ["Completed", summary?.completedConsultations ?? 0],
            ["Current Token", summary?.currentToken ?? "—"],
            ["Next Token", summary?.nextToken ?? "—"],
            ["Active Rooms", summary?.activeRooms ?? 0]
          ].map(([label, value]) => (
            <article key={label} className="rounded-md border bg-white p-5">
              <p className="text-sm text-slate-600">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-md border px-4 py-2" href="/admin/appointments">
            Appointments
          </Link>
          <Link className="rounded-md border px-4 py-2" href="/admin/queue">
            Queue
          </Link>
          <Link className="rounded-md border px-4 py-2" href="/admin/check-in">
            Staff Check-In
          </Link>
          <Link className="rounded-md border px-4 py-2" href="/admin/analytics">
            Analytics
          </Link>
        </div>
      </AdminShell>
    </RequireRole>
  );
}
