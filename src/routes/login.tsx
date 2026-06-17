import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, LuxButton, LuxField } from "@/components/AuthShell";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { getPostLoginRedirect } from "@/lib/auth/redirect";

type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Login — CashoutFX" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setError("Authentication is not configured. Add your Supabase credentials.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate({ to: getPostLoginRedirect(redirectTo) });
  };

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign In to CashoutFX"
      subtitle="Access your private trading dashboard."
      footer={
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/get-started" className="text-gold hover:underline">Get Started</Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <LuxField label="Email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" autoComplete="email" />
        <LuxField label="Password" name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••••" autoComplete="current-password" />
        <div className="flex justify-end">
          <a href="#" className="text-xs text-muted-foreground hover:text-gold">Forgot password?</a>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <LuxButton type="submit" disabled={submitting}>LOGIN</LuxButton>
      </form>
    </AuthShell>
  );
}
