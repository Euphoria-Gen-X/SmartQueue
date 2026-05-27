import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          SmartQueue
        </p>
        <h1 className="mt-3 text-4xl font-bold">Appointment and queue management</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Book appointments, track queue position, check in, and manage daily operations.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-md bg-emerald-700 px-4 py-2 text-white" href="/login">
            Customer Login
          </Link>
          <Link className="rounded-md border border-emerald-700 px-4 py-2" href="/register">
            Register
          </Link>
          <Link className="rounded-md border border-slate-300 px-4 py-2" href="/admin/login">
            Admin Login
          </Link>
          <Link className="rounded-md border border-zinc-300 px-4 py-2" href="/dashboard">
            Customer Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
