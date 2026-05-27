const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin" | "staff";
  token: string;
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("smartqueueToken");
};

export const saveSession = (user: SessionUser) => {
  localStorage.setItem("smartqueueToken", user.token);
  localStorage.setItem("smartqueueUser", JSON.stringify(user));
};

export const getSessionUser = (): SessionUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem("smartqueueUser");
  return user ? JSON.parse(user) : null;
};

export const clearSession = () => {
  localStorage.removeItem("smartqueueToken");
  localStorage.removeItem("smartqueueUser");
};

export const apiRequest = async <T = any>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({} as { message?: string; data?: unknown }));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  if (data && typeof data === "object" && "success" in data && "data" in data) {
    return data.data as T;
  }

  return data as T;
};
