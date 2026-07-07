import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  checkMarketplaceBalance,
  openMarketplaceUrl,
  TRADERS_MARKETPLACE_URLS,
} from "@/lib/api/tradersMarketplace";

type ModalView =
  | "form"
  | "loading"
  | "no_account"
  | "inactive"
  | "insufficient_balance"
  | "success"
  | "error";

type BalanceDetails = {
  currentBalance: number;
  requiredBalance: number;
  remainingAmount: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function validateAccountId(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Account ID is required.";
  }
  if (!/^\d+$/.test(trimmed)) {
    return "Account ID must contain numbers only.";
  }
  return null;
}

export function MarketplaceVerificationModal({ open, onOpenChange }: Props) {
  const [view, setView] = useState<ModalView>("form");
  const [accountId, setAccountId] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [balanceDetails, setBalanceDetails] = useState<BalanceDetails | null>(null);

  const controlsDisabled = view === "loading" || view === "success";

  const resetState = () => {
    setView("form");
    setAccountId("");
    setValidationError(null);
    setErrorMessage(null);
    setBalanceDetails(null);
  };

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  useEffect(() => {
    if (view !== "success") return;

    const redirectTimer = window.setTimeout(() => {
      openMarketplaceUrl(TRADERS_MARKETPLACE_URLS.automatedTrading);
    }, 2000);

    return () => window.clearTimeout(redirectTimer);
  }, [view]);

  const openExternal = (url: string) => {
    openMarketplaceUrl(url);
  };

  const handleContinue = async () => {
    const validation = validateAccountId(accountId);
    if (validation) {
      setValidationError(validation);
      return;
    }

    setValidationError(null);
    setErrorMessage(null);
    setView("loading");

    const result = await checkMarketplaceBalance(accountId.trim());

    switch (result.status) {
      case "verified":
        setView("success");
        return;
      case "no_account":
        setView("no_account");
        return;
      case "inactive":
        setView("inactive");
        return;
      case "insufficient_balance":
        setBalanceDetails({
          currentBalance: result.currentBalance,
          requiredBalance: result.requiredBalance,
          remainingAmount: result.remainingAmount,
        });
        setView("insufficient_balance");
        return;
      case "error":
        setErrorMessage(result.message);
        setView("error");
        toast.error(result.message);
        return;
      default:
        setErrorMessage("Unexpected response from verification service.");
        setView("error");
        toast.error("Unexpected response from verification service.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (controlsDisabled) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="glass shadow-luxury border-border/70 sm:max-w-md">
        <AnimatePresence mode="wait">
          {view === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold shadow-gold-glow">
                <Check className="h-8 w-8 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <h3 className="mt-5 font-display text-2xl text-foreground">Account Verified</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Redirecting you to AI Signals…
              </p>
              <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-gold" />
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-foreground">
                  Activate AI Signals
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                  Enter your TradersMarketsPlace Account ID. If you don&apos;t already have an
                  account, create one first.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                {view === "form" && (
                  <>
                    <button
                      type="button"
                      onClick={() => openExternal(TRADERS_MARKETPLACE_URLS.register)}
                      disabled={controlsDisabled}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-5 py-3 text-xs font-semibold tracking-[0.2em] text-foreground hover:border-gold/60 transition-all disabled:opacity-50"
                    >
                      CREATE MARKETPLACE ACCOUNT
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>

                    <label className="block">
                      <span className="block text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-2">
                        Account ID
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={accountId}
                        onChange={(e) => {
                          setAccountId(e.target.value);
                          if (validationError) setValidationError(null);
                        }}
                        disabled={controlsDisabled}
                        placeholder="Enter your account ID"
                        className="w-full rounded-lg bg-input/40 border border-border/70 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-gold/60 focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
                      />
                      {validationError && (
                        <p className="mt-2 text-xs text-destructive">{validationError}</p>
                      )}
                    </label>

                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={controlsDisabled}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-xs font-semibold tracking-[0.3em] text-primary-foreground shadow-gold-glow hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      CONTINUE
                    </button>
                  </>
                )}

                {view === "loading" && (
                  <div className="py-8 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold" />
                    <p className="mt-4 text-sm text-muted-foreground">Verifying your account…</p>
                  </div>
                )}

                {view === "no_account" && (
                  <div className="space-y-4">
                    <p className="text-sm text-foreground">
                      No TradersMarketsPlace account was found.
                    </p>
                    <button
                      type="button"
                      onClick={() => openExternal(TRADERS_MARKETPLACE_URLS.register)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-xs font-semibold tracking-[0.3em] text-primary-foreground shadow-gold-glow hover:scale-[1.02] transition-all"
                    >
                      CREATE MARKETPLACE ACCOUNT
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {view === "inactive" && (
                  <p className="text-sm text-foreground">
                    Your TradersMarketsPlace account is inactive.
                  </p>
                )}

                {view === "insufficient_balance" && balanceDetails && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border/70 bg-secondary/30 p-4 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Current Balance</span>
                        <span className="font-medium text-foreground">
                          {currency.format(balanceDetails.currentBalance)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Required Balance</span>
                        <span className="font-medium text-foreground">
                          {currency.format(balanceDetails.requiredBalance)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-border/50 pt-2">
                        <span className="text-muted-foreground">Remaining Amount</span>
                        <span className="font-medium text-gold">
                          {currency.format(balanceDetails.remainingAmount)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openExternal(TRADERS_MARKETPLACE_URLS.deposit)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-xs font-semibold tracking-[0.3em] text-primary-foreground shadow-gold-glow hover:scale-[1.02] transition-all"
                    >
                      TOP UP ACCOUNT
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {view === "error" && errorMessage && (
                  <div className="space-y-4">
                    <p className="text-sm text-destructive">{errorMessage}</p>
                    <button
                      type="button"
                      onClick={() => setView("form")}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-6 py-3.5 text-xs font-semibold tracking-[0.3em] text-foreground hover:border-gold/60 transition-all"
                    >
                      TRY AGAIN
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
