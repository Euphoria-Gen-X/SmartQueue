"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, clearSession } from "../../lib/api";

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();

  const logout = async () => {
    await apiRequest("/admin/auth/logout", { method: "POST" }).catch(() => undefined);
    clearSession();
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link href="/admin/dashboard" className="text-lg font-bold text-emerald-800">
            SmartQueue Admin
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/admin/dashboard">Dashboard</Link>
            <Link href="/admin/appointments">Appointments</Link>
            <Link href="/admin/queue">Queue</Link>
            <Link href="/admin/analytics">Analytics</Link>
            <Link href="/admin/services">Consultations</Link>
            <Link href="/admin/check-in">Check-In</Link>
            <button onClick={logout} className="rounded-md border px-3 py-1.5">
              Logout
            </button>
          </div>
        </div>
      </nav>
      <section className="mx-auto max-w-6xl px-5 py-8">{children}</section>
    </main>
  );
}
