import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AuthShell, LuxButton, LuxField } from "@/components/AuthShell";
import { canonicalLink } from "@/lib/seo";

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [{ title: "Get Started — CashoutFX" }],
    links: [canonicalLink("/get-started")],
  }),
  component: GetStarted,
});

function GetStarted() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "" });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try { sessionStorage.setItem("nebz_lead", JSON.stringify(form)); } catch {}
    navigate({ to: "/register" });
  };

  return (
    <AuthShell
      step={{ current: 1, total: 3, label: "Onboarding" }}
      eyebrow="Step One"
      title="Let's Get To Know You."
      subtitle="Complete your details to begin your journey."
      footer={
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-gold hover:underline">Login</Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <LuxField label="Full Name" name="fullName" value={form.fullName} onChange={onChange} placeholder="Your full legal name" autoComplete="name" />
        <LuxField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="+254 712 345 678" autoComplete="tel" />
        <LuxField label="Email Address" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" autoComplete="email" />
        <div className="pt-2">
          <LuxButton type="submit">CONTINUE</LuxButton>
        </div>
      </form>
    </AuthShell>
  );
}
