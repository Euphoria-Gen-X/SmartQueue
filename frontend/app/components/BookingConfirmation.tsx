"use client";

import Link from "next/link";

type BookingConfirmationProps = {
  appointment: {
    appointmentCode?: string;
    tokenNumber: number;
    slotTime: string;
    qrCodeDataUrl?: string;
    serviceId?: { name: string };
  };
  onClose: () => void;
};

export default function BookingConfirmation({ appointment, onClose }: BookingConfirmationProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="max-w-md rounded-lg border bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-emerald-800">Booking Confirmed</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Appointment ID</dt>
            <dd className="font-semibold">{appointment.appointmentCode}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Token Number</dt>
            <dd className="font-semibold">{appointment.tokenNumber}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Consultation</dt>
            <dd className="font-semibold">{appointment.serviceId?.name || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-600">Slot</dt>
            <dd className="font-semibold">{new Date(appointment.slotTime).toLocaleString()}</dd>
          </div>
        </dl>
        {appointment.qrCodeDataUrl ? (
          <img
            src={appointment.qrCodeDataUrl}
            alt="Check-in QR code"
            className="mx-auto mt-4 h-40 w-40 rounded-md border p-2"
          />
        ) : null}
        <p className="mt-3 text-center text-xs text-slate-500">
          A confirmation email has been sent (if email is configured).
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 rounded-md bg-emerald-700 px-4 py-2 text-center text-white"
          >
            View Dashboard
          </Link>
          <button type="button" onClick={onClose} className="flex-1 rounded-md border px-4 py-2">
            Book Another
          </button>
        </div>
      </div>
    </div>
  );
}
