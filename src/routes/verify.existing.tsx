import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AuthShell, LuxButton, LuxField } from "@/components/AuthShell";
import { Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/verify/existing")({
  head: () => ({ meta: [{ title: "Verify Account — NEBZ" }] }),
  component: Existing,
});

function Existing() {
  const navigate = useNavigate();
  const [referrer, setReferrer] = useState<"Nebz" | "Nyathira" | null>(null);
  const [poId, setPoId] = useState("");
  const [stage, setStage] = useState<"form" | "loading" | "success">("form");

  const onVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referrer || !poId) return;
    setStage("loading");
    setTimeout(() => setStage("success"), 2200);
  };

  return (
    <AuthShell
      eyebrow="Existing Member"
      title={stage === "success" ? "Verified." : "Verify Your Account"}
      subtitle={stage === "success" ? "Welcome to the inner circle." : "Provide your details for confirmation."}
      footer={
        stage === "form" ? (
          <p className="text-center">
            New here?{" "}
            <Link to="/verify/new" className="text-gold hover:underline">Create an account</Link>
          </p>
        ) : null
      }
    >
      <AnimatePresence mode="wait">
        {stage === "form" && (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onVerify}
            className="space-y-6"
          >
            <div>
              <p className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-3">Who referred you?</p>
              <div className="grid grid-cols-2 gap-3">
                {(["Nebz", "Nyathira"] as const).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setReferrer(r)}
                    className={`rounded-lg px-4 py-3 text-sm tracking-wide transition-all ${
                      referrer === r
                        ? "bg-gradient-gold text-primary-foreground shadow-gold-glow"
                        : "glass hover:border-gold/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <LuxField
              label="Pocket Option ID"
              name="poId"
              value={poId}
              onChange={(e) => setPoId(e.target.value)}
              placeholder="e.g. 88123456"
            />
            <LuxButton type="submit" disabled={!referrer || !poId}>
              VERIFY ACCOUNT
            </LuxButton>
          </motion.form>
        )}

        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-10 text-center"
          >
            <Loader2 className="h-10 w-10 text-gold mx-auto animate-spin" />
            <p className="mt-6 text-sm text-foreground">Verifying with Pocket Option…</p>
            <p className="mt-2 text-xs text-muted-foreground">Cross-checking your referral and account ID.</p>
          </motion.div>
        )}

        {stage === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="h-16 w-16 mx-auto rounded-full bg-gradient-gold flex items-center justify-center shadow-gold-glow"
            >
              <Check className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <p className="mt-6 text-base text-foreground">Your account has been verified successfully.</p>
            <p className="mt-2 text-xs text-muted-foreground">A concierge will reach out within 24 hours.</p>
            <div className="mt-8">
              <LuxButton onClick={() => navigate({ to: "/dashboard" })}>CONTINUE</LuxButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
