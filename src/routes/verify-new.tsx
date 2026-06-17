import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AuthShell, LuxButton } from "@/components/AuthShell";
import { ExternalLink, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { AuthSessionLoader } from "@/components/AuthSessionLoader";
import { submitReferralRedirect } from "@/lib/supabase/referral-redirects";

export const Route = createFileRoute("/verify-new")({
  head: () => ({ meta: [{ title: "Continue Registration — CashoutFX" }] }),
  component: NewUser,
});

function NewUser() {
  const navigate = useNavigate();
  const { user, loading } = useRequireAuth();
  const [inviter, setInviter] = useState<"Nebz" | "Nyathira" | null>(null);
  const [stage, setStage] = useState<"form" | "redirect">("form");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading || !user) return <AuthSessionLoader />;

  const onProceed = async () => {
    if (!inviter) return;

    if (!user) {
      setError("Please sign in to continue.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const result = await submitReferralRedirect(user.id, inviter);

    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setStage("redirect");
    window.location.assign(result.redirectUrl);
  };

  return (
    <AuthShell
      eyebrow="New Member"
      title={stage === "form" ? "Continue Your Registration" : "Setting Up Your Account"}
      subtitle={stage === "form" ? "Tell us who invited you to begin." : "We're preparing your Pocket Option setup."}
      footer={
        stage === "form" ? (
          <p className="text-center">
            Already a member?{" "}
            <Link to="/verify-existing" className="text-gold hover:underline">Verify instead</Link>
          </p>
        ) : null
      }
    >
      <AnimatePresence mode="wait">
        {stage === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div>
              <p className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-3">Who invited you?</p>
              <div className="grid grid-cols-2 gap-3">
                {(["Nebz", "Nyathira"] as const).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setInviter(r)}
                    className={`rounded-lg px-4 py-3 text-sm tracking-wide transition-all ${
                      inviter === r
                        ? "bg-gradient-gold text-primary-foreground shadow-gold-glow"
                        : "glass hover:border-gold/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <LuxButton onClick={onProceed} disabled={!inviter || submitting}>PROCEED</LuxButton>
          </motion.div>
        )}

        {stage === "redirect" && (
          <motion.div
            key="redirect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center"
          >
            <div className="relative h-16 w-16 mx-auto">
              <Loader2 className="h-16 w-16 text-gold animate-spin" />
              <ExternalLink className="h-6 w-6 text-gold absolute inset-0 m-auto" />
            </div>
            <p className="mt-6 text-base text-foreground">
              You are being redirected to complete your account setup.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              This usually takes only a moment. Please don't close this window.
            </p>
            <div className="mt-8">
              <LuxButton onClick={() => navigate({ to: "/dashboard" })}>CONTINUE</LuxButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
