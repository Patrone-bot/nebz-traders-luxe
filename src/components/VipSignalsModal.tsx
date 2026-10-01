import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ExternalLink, Loader2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  checkY2Deposit,
  VIP_SIGNALS_REQUIRED_AMOUNT,
  VIP_TELEGRAM_URL,
  Y2_MARKETPLACE_URLS,
} from "@/lib/api/y2markets";

type ModalView = "ask" | "create" | "fund" | "success";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const secondaryButtonClass =
  "w-full inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-5 py-3 text-xs font-semibold tracking-[0.2em] text-foreground hover:border-gold/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
const primaryButtonClass =
  "w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-xs font-semibold tracking-[0.3em] text-primary-foreground shadow-gold-glow hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed";

export function VipSignalsModal({ open, onOpenChange }: Props) {
  const [view, setView] = useState<ModalView>("ask");
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (open) return;
    setView("ask");
    setUsername("");
    setChecking(false);
    setErrorMessage(null);
  }, [open]);

  const handleConfirm = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setErrorMessage("Enter your Y2 Markets username so we can confirm your $500 VIP payment.");
      return;
    }

    setChecking(true);
    setErrorMessage(null);

    const result = await checkY2Deposit(trimmed, VIP_SIGNALS_REQUIRED_AMOUNT);
    setChecking(false);

    switch (result.status) {
      case "verified":
        setView("success");
        return;
      case "no_account":
        setErrorMessage(
          "We couldn't find a Y2 Markets account with that username. Create it first with the buttons above, then try again.",
        );
        return;
      case "insufficient_balance":
        setErrorMessage(
          `We can't see your ${currency.format(result.requiredAmount)} VIP payment on this account yet. Confirmed so far: ${currency.format(result.confirmedDeposits)}. Pay it from your Y2 Markets dashboard, then try again.`,
        );
        return;
      default:
        setErrorMessage(result.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <h3 className="mt-5 font-display text-2xl text-foreground">Payment Confirmed</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your seat in the VIP signals room is open for the full week. Every setup we take
                from here on lands straight in your Telegram.
              </p>
              <button
                type="button"
                onClick={() => openExternal(VIP_TELEGRAM_URL)}
                className={`${primaryButtonClass} mt-6`}
              >
                JOIN VIP SIGNALS ON TELEGRAM
                <Send className="h-3.5 w-3.5" />
              </button>
              <p className="mt-4 text-xs text-muted-foreground">
                Your $500 stays in your own Y2 Markets account as trading capital. The week of VIP
                signals is already unlocked.
              </p>
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
                  Unlock VIP Signals
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                  Pay $500, we confirm it on our side, and the VIP signals room is yours for one
                  full week.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                {view === "ask" && (
                  <>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      First, tell us where you stand: do you already have a Y2 Markets account
                      under <span className="text-foreground">Don01</span> or{" "}
                      <span className="text-foreground">nyathira</span>?
                    </p>
                    <button
                      type="button"
                      onClick={() => setView("fund")}
                      className={primaryButtonClass}
                    >
                      YES, I HAVE MY ACCOUNT
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("create")}
                      className={secondaryButtonClass}
                    >
                      NO, I DON&apos;T HAVE AN ACCOUNT YET
                    </button>
                  </>
                )}

                {view === "create" && (
                  <>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      No problem. Create your Y2 Markets account under one of our masters
                      below. Your referrer is filled in for you, so your account is linked to
                      us from day one.
                    </p>
                    <button
                      type="button"
                      onClick={() => openExternal(Y2_MARKETPLACE_URLS.signupDon01)}
                      className={secondaryButtonClass}
                    >
                      CREATE ACCOUNT UNDER DON01
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openExternal(Y2_MARKETPLACE_URLS.signupNyathira)}
                      className={secondaryButtonClass}
                    >
                      CREATE ACCOUNT UNDER NYATHIRA
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Once your account is ready, pay the $500 VIP access fee into your Y2 Markets
                      account. Then enter your Y2 Markets username here and confirm. We check your
                      payment before opening the VIP room for the week.
                    </p>
                    <label className="block">
                      <span className="block text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-2">
                        Y2 Markets Username
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        disabled={checking}
                        placeholder="Your Y2 Markets username"
                        className="w-full rounded-lg bg-input/40 border border-border/70 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-gold/60 focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
                      />
                    </label>
                    {errorMessage && (
                      <p className="text-xs text-destructive leading-relaxed">{errorMessage}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={checking}
                      className={primaryButtonClass}
                    >
                      {checking ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          CONFIRMING YOUR PAYMENT
                        </>
                      ) : (
                        "I'VE PAID THE $500, CONFIRM IT"
                      )}
                    </button>
                  </>
                )}

                {view === "fund" && (
                  <>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Great. VIP access is $500 for one week. Pay that into your Y2 Markets
                      account, and if it isn't there yet, add it now from your dashboard.
                    </p>
                    <button
                      type="button"
                      onClick={() => openExternal(Y2_MARKETPLACE_URLS.dashboard)}
                      className={secondaryButtonClass}
                    >
                      OPEN Y2 MARKETS
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      When your $500 payment is in, enter your Y2 Markets username here. We
                      confirm it on our side before opening the VIP signals room for the week.
                    </p>
                    <label className="block">
                      <span className="block text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-2">
                        Y2 Markets Username
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        disabled={checking}
                        placeholder="Your Y2 Markets username"
                        className="w-full rounded-lg bg-input/40 border border-border/70 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-gold/60 focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
                      />
                    </label>
                    {errorMessage && (
                      <p className="text-xs text-destructive leading-relaxed">{errorMessage}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={checking}
                      className={primaryButtonClass}
                    >
                      {checking ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          CONFIRMING YOUR PAYMENT
                        </>
                      ) : (
                        "MY $500 PAYMENT IS IN, CONFIRM IT"
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
