import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth-context";
import { isAdminEmail } from "@/lib/auth/admin";

export function useRequireAdmin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate({
        to: "/login",
        search: { redirect: "/admin" },
        replace: true,
      });
      return;
    }

    if (!isAdminEmail(user.email)) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [loading, user, navigate]);

  return { user, loading, isAdmin };
}
