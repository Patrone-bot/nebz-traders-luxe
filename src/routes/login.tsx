import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, LuxButton, LuxField } from "@/components/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — NEBZ" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign In to NEBZ"
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
        <LuxButton type="submit">LOGIN</LuxButton>
      </form>
    </AuthShell>
  );
}
