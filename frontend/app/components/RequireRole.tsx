"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionUser } from "../../lib/api";

type RequireRoleProps = {
  children: ReactNode;
  role: "customer" | "admin";
  redirectTo: string;
};

export default function RequireRole({ children, role, redirectTo }: RequireRoleProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = getSessionUser();
    if (!user) {
      router.replace(redirectTo);
      return;
    }

    if (role === "admin" && user.role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    if (role === "customer" && user.role !== "customer") {
      router.replace("/admin/dashboard");
      return;
    }

    setAllowed(true);
  }, [role, redirectTo, router]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}

