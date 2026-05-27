"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import AdminShell from "../../components/AdminShell";
import RequireRole from "../../components/RequireRole";
import StatusMessage from "../../components/StatusMessage";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/admin/analytics")
      .then(setAnalytics)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <RequireRole role="admin" redirectTo="/admin/login">
      <AdminShell>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <StatusMessage error={error} />
        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-md border bg-white p-4">
            <h2 className="font-semibold">Status Breakdown</h2>
            <div className="mt-4 space-y-2">
              {(analytics?.statusBreakdown || []).map((item) => (
                <p key={item._id} className="flex justify-between text-sm">
                  <span>{item._id}</span>
                  <span className="font-semibold">{item.count}</span>
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-md border bg-white p-4">
            <h2 className="font-semibold">Upcoming Appointments</h2>
            <div className="mt-4 space-y-3">
              {(analytics?.upcomingAppointments || []).map((appointment) => (
                <p key={appointment._id} className="text-sm text-slate-600">
                  {appointment.userId?.name} | {appointment.serviceId?.name} |{" "}
                  {new Date(appointment.slotTime).toLocaleString()}
                </p>
              ))}
            </div>
          </div>
        </section>
      </AdminShell>
    </RequireRole>
  );
}
