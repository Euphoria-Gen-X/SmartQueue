"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import AdminShell from "../../components/AdminShell";
import QrScanner from "../../components/QrScanner";
import RequireRole from "../../components/RequireRole";
import StatusMessage from "../../components/StatusMessage";
import { useToast } from "../../components/Toast";

type CheckInLog = {
  _id: string;
  tokenNumber: number;
  method: string;
  checkedInAt: string;
  userId?: { name: string; email: string };
  appointmentId?: { serviceId?: { name: string } };
};

export default function AdminCheckInPage() {
  const { showToast } = useToast();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logs, setLogs] = useState<CheckInLog[]>([]);

  const loadLogs = () => {
    apiRequest<CheckInLog[]>("/admin/check-in-logs?limit=20")
      .then(setLogs)
      .catch(() => {});
  };

  useEffect(() => {
    loadLogs();
    const interval = window.setInterval(loadLogs, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const checkInPayload = async (payload: string) => {
    setError("");
    setSuccess("");
    try {
      const result = await apiRequest("/admin/qr/check-in", {
        method: "POST",
        body: JSON.stringify({ payload })
      });
      const msg = result?.alreadyCheckedIn
        ? "Customer was already checked in."
        : "Check-in successful.";
      setSuccess(msg);
      showToast(msg, "success");
      loadLogs();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Check-in failed";
      setError(message);
      showToast(message, "error");
    }
  };

  return (
    <RequireRole role="admin" redirectTo="/admin/login">
      <AdminShell>
        <h1 className="text-2xl font-bold">Staff QR Check-In</h1>
        <p className="mt-1 text-slate-600">Scan a customer&apos;s appointment QR at the front desk.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <QrScanner onScan={checkInPayload} />
          <div>
            <StatusMessage error={error} success={success} />
            <h2 className="mt-6 font-semibold">Recent Check-Ins</h2>
            <ul className="mt-3 space-y-2">
              {logs.map((log) => (
                <li key={log._id} className="rounded-md border bg-white p-3 text-sm">
                  <p className="font-medium">
                    Token {log.tokenNumber} — {log.userId?.name || "Customer"}
                  </p>
                  <p className="text-slate-600">
                    {log.appointmentId?.serviceId?.name} | {log.method} |{" "}
                    {new Date(log.checkedInAt).toLocaleString()}
                  </p>
                </li>
              ))}
              {!logs.length ? <p className="text-slate-500">No check-ins yet today.</p> : null}
            </ul>
          </div>
        </div>
      </AdminShell>
    </RequireRole>
  );
}
