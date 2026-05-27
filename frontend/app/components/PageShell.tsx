"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, clearSession, getSessionUser } from "../../lib/api";

type PageShellProps = {
  children: ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  const router = useRouter();
  const user = getSessionUser();

  const logout = async () => {
    await apiRequest("/customer/auth/logout", { method: "POST" }).catch(() => undefined);
    clearSession();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link href="/" className="text-lg font-bold text-emerald-800">
            SmartQueue
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/book-appointment">Book</Link>
            <Link href="/queue-status">Queue</Link>
            <Link href="/check-in">Check-In</Link>
            <Link href="/admin/login" className="text-slate-600">
              Admin
            </Link>
            {user ? (
              <button onClick={logout} className="rounded-md border px-3 py-1.5">
                Logout
              </button>
            ) : (
              <Link href="/login" className="rounded-md border px-3 py-1.5">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <section className="mx-auto max-w-6xl px-5 py-8">{children}</section>
    </main>
  );
}
