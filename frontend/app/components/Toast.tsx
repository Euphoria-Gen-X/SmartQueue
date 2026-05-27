"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";

type ToastState = {
  message: string;
  type: ToastType;
} | null;

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 4000);
  }, []);

  const color =
    toast?.type === "success"
      ? "bg-emerald-700"
      : toast?.type === "error"
        ? "bg-red-600"
        : "bg-slate-800";

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-md px-4 py-3 text-sm text-white shadow-lg ${color}`}
          role="status"
        >
          {toast.message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
};
