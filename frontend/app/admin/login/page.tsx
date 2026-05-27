"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, saveSession } from "../../../lib/api";
import StatusMessage from "../../components/StatusMessage";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const user = await apiRequest("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });
      if (user.role !== "admin") {
        setError("Admin access only. Use customer login for patient accounts.");
        return;
      }
      saveSession(user);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-md rounded-md border bg-white p-6">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Admin Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <StatusMessage error={error} />
          <button className="w-full rounded-md bg-emerald-700 px-4 py-2 text-white">Login</button>
        </form>
      </section>
    </main>
  );
}

