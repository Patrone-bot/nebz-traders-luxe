import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AuthShell, LuxButton, LuxField } from "@/components/AuthShell";
import { Check, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { AuthSessionLoader } from "@/components/AuthSessionLoader";
import { VerificationSuccessVvipCard } from "@/components/VerificationSuccessVvipCard";
import { callVerifyPocketPartners } from "@/lib/api/verify-pocket-partners";
import { supabase } from "@/lib/supabase/client";
import { submitExistingAccountVerification } from "@/lib/supabase/verification-requests";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const Route = createFileRoute("/verify-existing")({
  head: () => ({ meta: [{ title: "Verify Account — CashoutFX" }, NOINDEX_ROBOTS] }),
  component: Existing,
});

// TradersHub Marketplace registration links, one per partner.
const TRADERSHUB_REGISTER_URL_NEBZ = "https://tradersmarketsplace.com/register.php?ref=27375C9D";
const TRADERSHUB_REGISTER_URL_NYATHIRA = "https://tradersmarketsplace.com/register.php?ref=C9E7307D";

function Existing() {
  const navigate = useNavigate();
  const { user, loading } = useRequireAuth();
  const [pocketTraderId, setPocketTraderId] = useState("");
  const [stage, setStage] = useState<"form" | "loading" | "success" | "failure">("form");
  const [error, setError] = useState<string | null>(null);
  const [verifiedUnder, setVerifiedUnder] = useState<"Nebz" | "Nyathira" | null>(null);
  const [failureReason, setFailureReason] = useState<"no_marketplace_account" | null>(null);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

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
    setFailureReason(null);
    setFailureMessage(null);
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

    if (verifyResult.reason === "no_marketplace_account") {
      setFailureReason("no_marketplace_account");
      if (verifyResult.verifiedUnder) {
        setVerifiedUnder(verifyResult.verifiedUnder);
      }
    }
    setFailureMessage(verifyResult.message);

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
            <VerificationSuccessVvipCard
              onContinueToDashboard={() => navigate({ to: "/dashboard" })}
            />
          </motion.div>
        )}

        {stage === "failure" && (
          <motion.div
            key="failure"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            {failureReason === "no_marketplace_account" ? (
              <>
                <p className="text-base text-foreground">
                  {failureMessage ??
                    "Your Pocket Option account was verified, but we couldn't find a TradersHub Marketplace account for your email."}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please create an account on TradersHub Marketplace, make a deposit, and then
                  reach out to us so we can complete your verification.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  <LuxButton
                    onClick={() =>
                      window.open(
                        verifiedUnder === "Nebz"
                          ? TRADERSHUB_REGISTER_URL_NEBZ
                          : TRADERSHUB_REGISTER_URL_NYATHIRA,
                        "_blank",
                      )
                    }
                  >
                    GO TO TRADERSHUB MARKETPLACE
                  </LuxButton>
                  <LuxButton onClick={() => setStage("form")}>TRY AGAIN</LuxButton>
                  <LuxButton variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>
                    BACK TO DASHBOARD
                  </LuxButton>
                </div>
              </>
            ) : (
              <>
                <p className="text-base text-foreground">
                  We could not verify this Pocket Option account under Nebz or Nyathira.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  <LuxButton onClick={() => setStage("form")}>TRY AGAIN</LuxButton>
                  <LuxButton variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>
                    BACK TO DASHBOARD
                  </LuxButton>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
