"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";
import PageShell from "../components/PageShell";
import StatusMessage from "../components/StatusMessage";
import { useToast } from "../components/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.phone || form.phone.length < 7) {
      setError("Phone number is required (7–15 digits).");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await apiRequest("/customer/auth/register", {
        method: "POST",
        body: JSON.stringify(form)
      });
      showToast("Account created. Log in to continue.", "success");
      router.push("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
      showToast(message, "error");
    }
  };

  return (
    <PageShell>
      <div className="max-w-md">
        <h1 className="text-2xl font-bold">Register</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {(["name", "email", "phone", "password"] as const).map((field) => (
            <input
              key={field}
              className="w-full rounded-md border px-3 py-2"
              placeholder={field === "name" ? "Full Name" : field[0].toUpperCase() + field.slice(1)}
              type={
                field === "password"
                  ? "password"
                  : field === "email"
                    ? "email"
                    : field === "phone"
                      ? "tel"
                      : "text"
              }
              required
              minLength={field === "phone" ? 7 : field === "password" ? 6 : undefined}
              value={form[field]}
              onChange={(event) => setForm({ ...form, [field]: event.target.value })}
            />
          ))}
          <StatusMessage error={error} />
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-white">Create Account</button>
        </form>
      </div>
    </PageShell>
  );
}
