"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, getSessionUser } from "../../lib/api";
import PageShell from "../components/PageShell";
import RequireRole from "../components/RequireRole";
import StatusMessage from "../components/StatusMessage";

type Appointment = {
  _id: string;
  appointmentCode?: string;
  tokenNumber: number;
  slotTime: string;
  status: string;
  qrCodeDataUrl?: string;
  serviceId?: {
    name: string;
    durationMinutes: number;
  };
};

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState("");
  const user = getSessionUser();

  useEffect(() => {
    apiRequest("/customer/appointments")
      .then(setAppointments)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <RequireRole role="customer" redirectTo="/login">
      <PageShell>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Customer Dashboard</h1>
            <p className="mt-1 text-slate-600">Welcome{user?.name ? `, ${user.name}` : ""}.</p>
          </div>
          <Link href="/book-appointment" className="rounded-md bg-emerald-700 px-4 py-2 text-white">
            Book Appointment
          </Link>
        </div>
        <div className="mt-6 space-y-3">
          <StatusMessage error={error} />
          {appointments.map((appointment) => (
            <article key={appointment._id} className="rounded-md border bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{appointment.serviceId?.name || "Appointment"}</p>
                  <p className="text-sm text-slate-600">
                    {new Date(appointment.slotTime).toLocaleString()} | Token {appointment.tokenNumber} |{" "}
                    {appointment.status}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Appointment ID: {appointment.appointmentCode || appointment._id}
                  </p>
                </div>
                {appointment.qrCodeDataUrl ? (
                  <img
                    src={appointment.qrCodeDataUrl}
                    alt={`QR for ${appointment.appointmentCode || appointment._id}`}
                    className="h-28 w-28 rounded-md border bg-white p-1"
                  />
                ) : null}
              </div>
            </article>
          ))}
          {!appointments.length && !error ? <p className="text-slate-600">No appointments yet.</p> : null}
        </div>
      </PageShell>
    </RequireRole>
  );
}
