"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, saveSession } from "../../lib/api";
import PageShell from "../components/PageShell";
import StatusMessage from "../components/StatusMessage";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const user = await apiRequest("/customer/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });
      if (user.role !== "customer") {
        setError("Please use the admin login page.");
        return;
      }
      saveSession(user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <PageShell>
      <div className="max-w-md">
        <h1 className="text-2xl font-bold">Customer Login</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Email"
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
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-white">Login</button>
        </form>
      </div>
    </PageShell>
  );
}
