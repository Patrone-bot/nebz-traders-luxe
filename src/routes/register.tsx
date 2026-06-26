import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, LuxButton, LuxField } from "@/components/AuthShell";
import { clearOnboardingLead, readOnboardingLead } from "@/lib/onboarding-lead";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { insertProfile } from "@/lib/supabase/profiles";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account — CashoutFX" }, NOINDEX_ROBOTS] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords don't match.");

    const lead = readOnboardingLead();
    if (!lead) {
      navigate({ to: "/get-started" });
      return;
    }

    if (!isSupabaseConfigured()) {
      setError("Authentication is not configured. Add your Supabase credentials.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: lead.email,
      password: form.password,
      options: {
        data: {
          full_name: lead.fullName,
          phone: lead.phone,
        },
      },
    });

    if (signUpError) {
      setSubmitting(false);
      setError(signUpError.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await insertProfile({
        id: data.user.id,
        full_name: lead.fullName,
        phone: lead.phone,
        email: lead.email,
      });

      if (profileError) {
        setSubmitting(false);
        setError(profileError.message);
        return;
      }
    }

    clearOnboardingLead();
    setSubmitting(false);
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell
      step={{ current: 2, total: 3, label: "Onboarding" }}
      eyebrow="Step Two"
      title="Create Your Account"
      subtitle="Set a secure password to protect your trading dashboard."
      footer={
        <p className="text-center">
          Prefer to sign in?{" "}
          <Link to="/login" className="text-gold hover:underline">Login</Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <LuxField label="Password" name="password" type="password" value={form.password} onChange={onChange} placeholder="At least 6 characters" autoComplete="new-password" />
        <LuxField label="Confirm Password" name="confirm" type="password" value={form.confirm} onChange={onChange} placeholder="Re-enter your password" autoComplete="new-password" />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="pt-2">
          <LuxButton type="submit" disabled={submitting}>CREATE ACCOUNT</LuxButton>
        </div>
      </form>
    </AuthShell>
  );
}
