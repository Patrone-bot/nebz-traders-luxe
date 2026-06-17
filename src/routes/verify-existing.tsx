import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AuthShell, LuxButton, LuxField } from "@/components/AuthShell";
import { Check, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { AuthSessionLoader } from "@/components/AuthSessionLoader";
import { callVerifyPocketPartners } from "@/lib/api/verify-pocket-partners";
import { supabase } from "@/lib/supabase/client";
import { submitExistingAccountVerification } from "@/lib/supabase/verification-requests";

export const Route = createFileRoute("/verify-existing")({
  head: () => ({ meta: [{ title: "Verify Account — CashoutFX" }] }),
  component: Existing,
});

function Existing() {
  const navigate = useNavigate();
  const { user, loading } = useRequireAuth();
  const [pocketTraderId, setPocketTraderId] = useState("");
  const [stage, setStage] = useState<"form" | "loading" | "success" | "failure">("form");
  const [error, setError] = useState<string | null>(null);
  const [verifiedUnder, setVerifiedUnder] = useState<"Nebz" | "Nyathira" | null>(null);

  if (loading || !user) return <AuthSessionLoader />;

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pocketTraderId.trim()) return;

    if (!user) {
      setError("Please sign in to verify your account.");
      return;
    }

    setError(null);
    setVerifiedUnder(null);
    setStage("loading");

    const createResult = await submitExistingAccountVerification(user.id, pocketTraderId);

    if (!createResult.ok) {
      setStage("form");
      setError(createResult.message);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setStage("form");
      setError("Please sign in to verify your account.");
      return;
    }

    const verifyResult = await callVerifyPocketPartners(
      createResult.verificationRequestId,
      pocketTraderId.trim(),
      session.access_token,
    );

    if (verifyResult.verified && verifyResult.verifiedUnder) {
      setVerifiedUnder(verifyResult.verifiedUnder);
      setStage("success");
      return;
    }

    setStage("failure");
  };

  return (
    <AuthShell
      eyebrow="Existing Member"
      title={
        stage === "success"
          ? "Verified."
          : stage === "failure"
            ? "Verification Failed"
            : "Verify Your Account"
      }
      subtitle={
        stage === "success"
          ? "Welcome to the inner circle."
          : "We'll automatically detect whether your Pocket Option account belongs to Nebz or Nyathira."
      }
      footer={
        stage === "form" ? (
          <p className="text-center">
            New here?{" "}
            <Link to="/verify-new" className="text-gold hover:underline">Create an account</Link>
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
            <LuxField
              label="Pocket Trader ID"
              name="pocketTraderId"
              value={pocketTraderId}
              onChange={(e) => setPocketTraderId(e.target.value)}
              placeholder="e.g. 88123456"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <LuxButton type="submit" disabled={!pocketTraderId.trim()}>
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
            <p className="mt-2 text-xs text-muted-foreground">
              Verifying your Pocket Option account. This usually takes a few seconds.
            </p>
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
            <p className="mt-6 text-base text-foreground">
              Your Pocket Option account has been verified successfully.
            </p>
            {verifiedUnder && (
              <p className="mt-2 text-sm text-gold">Verified under {verifiedUnder}</p>
            )}
            <div className="mt-8">
              <LuxButton onClick={() => navigate({ to: "/dashboard" })}>CONTINUE</LuxButton>
            </div>
          </motion.div>
        )}

        {stage === "failure" && (
          <motion.div
            key="failure"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <p className="text-base text-foreground">
              We could not verify this Pocket Option account under Nebz or Nyathira.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <LuxButton onClick={() => setStage("form")}>TRY AGAIN</LuxButton>
              <LuxButton variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>
                BACK TO DASHBOARD
              </LuxButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
