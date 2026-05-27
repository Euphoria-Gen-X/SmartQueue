"use client";

import { useState } from "react";
import { apiRequest } from "../../lib/api";
import PageShell from "../components/PageShell";
import QrScanner from "../components/QrScanner";
import RequireRole from "../components/RequireRole";
import StatusMessage from "../components/StatusMessage";

export default function CheckInPage() {
  const [appointmentId, setAppointmentId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const extractAppointmentId = (payload: string) => {
    try {
      const parsed = JSON.parse(payload);
      return parsed.appointmentId || payload;
    } catch (_error) {
      return payload;
    }
  };

  const checkIn = async (id: string) => {
    setError("");
    setSuccess("");

    try {
      await apiRequest("/customer/queue/check-in", {
        method: "POST",
        body: JSON.stringify({ appointmentId: id })
      });
      setSuccess("Check-in successful.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check-in failed");
    }
  };

  const checkInQrPayload = async (payload: string) => {
    setError("");
    setSuccess("");

    try {
      await apiRequest("/customer/qr/check-in", {
        method: "POST",
        body: JSON.stringify({ payload })
      });
      setAppointmentId(extractAppointmentId(payload));
      setSuccess("QR check-in successful.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "QR check-in failed");
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await checkIn(appointmentId);
  };

  return (
    <RequireRole role="customer" redirectTo="/login">
      <PageShell>
        <h1 className="text-2xl font-bold">QR Check-In</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <QrScanner
            onScan={(payload) => {
              checkInQrPayload(payload);
            }}
          />
          <form onSubmit={submit} className="space-y-4 rounded-md border bg-white p-4">
            <h2 className="font-semibold">Manual Check-In</h2>
            <input
              className="w-full rounded-md border px-3 py-2"
              placeholder="Appointment ID from QR code"
              value={appointmentId}
              onChange={(event) => setAppointmentId(event.target.value)}
            />
            <StatusMessage error={error} success={success} />
            <button className="rounded-md bg-emerald-700 px-4 py-2 text-white">Check In</button>
          </form>
        </div>
      </PageShell>
    </RequireRole>
  );
}
