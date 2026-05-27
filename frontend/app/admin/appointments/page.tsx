"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import AdminShell from "../../components/AdminShell";
import RequireRole from "../../components/RequireRole";
import StatusMessage from "../../components/StatusMessage";
import { useToast } from "../../components/Toast";

type Appointment = {
  _id: string;
  tokenNumber: number;
  slotTime: string;
  status: string;
  appointmentCode?: string;
  userId?: { name: string; email: string; phone?: string };
  serviceId?: { _id: string; name: string };
};

type Service = { _id: string; name: string };

export default function AdminAppointmentsPage() {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    serviceId: "",
    status: "",
    date: "",
    search: ""
  });

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filters.serviceId) params.set("serviceId", filters.serviceId);
    if (filters.status) params.set("status", filters.status);
    if (filters.date) params.set("date", filters.date);
    if (filters.search) params.set("search", filters.search);
    const q = params.toString();
    return q ? `?${q}` : "";
  };

  const load = useCallback(() => {
    setLoading(true);
    apiRequest<Appointment[]>(`/admin/appointments${buildQuery()}`)
      .then(setAppointments)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    apiRequest<Service[]>("/admin/services?includeInactive=true").then(setServices).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = async (id: string) => {
    try {
      await apiRequest(`/admin/appointments/${id}/cancel`, { method: "PATCH" });
      showToast("Appointment cancelled", "success");
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Cancel failed", "error");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiRequest(`/admin/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      showToast(`Status updated to ${status}`, "success");
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed", "error");
    }
  };

  return (
    <RequireRole role="admin" redirectTo="/admin/login">
      <AdminShell>
        <h1 className="text-2xl font-bold">Manage Appointments</h1>
        <div className="mt-4 grid gap-3 rounded-md border bg-white p-4 md:grid-cols-4">
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={filters.serviceId}
            onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}
          >
            <option value="">All consultations</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All statuses</option>
            {["booked", "checked-in", "in-service", "completed", "cancelled"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="rounded-md border px-3 py-2 text-sm"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Search name, email, ID…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="mt-6 space-y-3">
          <StatusMessage error={error} />
          {loading ? <p className="text-slate-600">Loading appointments...</p> : null}
          {appointments.map((appointment) => (
            <article key={appointment._id} className="rounded-md border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{appointment.userId?.name || "Customer"}</p>
                  <p className="text-sm text-slate-600">
                    {appointment.serviceId?.name} | {new Date(appointment.slotTime).toLocaleString()} |
                    Token {appointment.tokenNumber} | {appointment.status}
                  </p>
                  <p className="text-xs text-slate-500">ID: {appointment.appointmentCode || appointment._id}</p>
                  <p className="text-xs text-slate-500">
                    {appointment.userId?.email}
                    {appointment.userId?.phone ? ` | ${appointment.userId.phone}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {appointment.status !== "completed" && appointment.status !== "cancelled" ? (
                    <>
                      <button
                        onClick={() => updateStatus(appointment._id, "in-service")}
                        className="rounded-md border px-2 py-1 text-xs"
                      >
                        In Service
                      </button>
                      <button
                        onClick={() => updateStatus(appointment._id, "completed")}
                        className="rounded-md border px-2 py-1 text-xs"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => cancel(appointment._id)}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700"
                      >
                        Cancel
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
          {!appointments.length && !error && !loading ? (
            <p className="text-slate-600">No appointments match your filters.</p>
          ) : null}
        </div>
      </AdminShell>
    </RequireRole>
  );
}
