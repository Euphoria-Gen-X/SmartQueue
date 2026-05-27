"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/api";
import AdminShell from "../../components/AdminShell";
import RequireRole from "../../components/RequireRole";
import StatusMessage from "../../components/StatusMessage";

type Service = {
  _id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  isActive: boolean;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({ name: "", description: "", durationMinutes: 30 });
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    apiRequest<Service[]>("/admin/services?includeInactive=true")
      .then(setServices)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load services"));
  };

  useEffect(load, []);

  const resetForm = () => {
    setEditingId("");
    setForm({ name: "", description: "", durationMinutes: 30 });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await apiRequest(editingId ? `/admin/services/${editingId}` : "/admin/services", {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify(form)
      });
      setSuccess(editingId ? "Service updated." : "Service created.");
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Service save failed");
    }
  };

  const deactivate = async (id: string) => {
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/admin/services/${id}`, { method: "DELETE" });
      setSuccess("Service deactivated.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to deactivate service");
    }
  };

  return (
    <RequireRole role="admin" redirectTo="/admin/login">
      <AdminShell>
        <h1 className="text-2xl font-bold">Consultation Types</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <form onSubmit={submit} className="space-y-4 rounded-md border bg-white p-4">
            <h2 className="font-semibold">{editingId ? "Edit Consultation Type" : "Create Consultation Type"}</h2>
            <input
              className="w-full rounded-md border px-3 py-2"
              placeholder="Consultation name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <textarea
              className="min-h-24 w-full rounded-md border px-3 py-2"
              placeholder="Description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
            <input
              className="w-full rounded-md border px-3 py-2"
              min={5}
              max={480}
              type="number"
              value={form.durationMinutes}
              onChange={(event) =>
                setForm({ ...form, durationMinutes: Number(event.target.value) })
              }
            />
            <StatusMessage error={error} success={success} />
            <div className="flex gap-3">
              <button className="rounded-md bg-emerald-700 px-4 py-2 text-white">
                {editingId ? "Update" : "Create"}
              </button>
              {editingId ? (
                <button type="button" onClick={resetForm} className="rounded-md border px-4 py-2">
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
          <section className="space-y-3">
            {services.map((service) => (
              <article key={service._id} className="rounded-md border bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-slate-600">
                      {service.durationMinutes} min | {service.isActive ? "Active" : "Inactive"}
                    </p>
                    {service.description ? (
                      <p className="mt-1 text-sm text-slate-600">{service.description}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(service._id);
                        setForm({
                          name: service.name,
                          description: service.description || "",
                          durationMinutes: service.durationMinutes
                        });
                      }}
                      className="rounded-md border px-3 py-1.5"
                    >
                      Edit
                    </button>
                    {service.isActive ? (
                      <button
                        onClick={() => deactivate(service._id)}
                        className="rounded-md border px-3 py-1.5"
                      >
                        Deactivate
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </AdminShell>
    </RequireRole>
  );
}
