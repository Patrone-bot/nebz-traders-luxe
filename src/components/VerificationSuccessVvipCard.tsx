import { motion } from "motion/react";
import { Check } from "lucide-react";
import { LuxButton } from "@/components/AuthShell";

const VVIP_TELEGRAM_URL = "https://t.me/+PUBJRu4tKPpmYzk0";

const BENEFITS = [
  "Market updates",
  "Premium trading discussions",
  "Community support",
  "VIP announcements",
] as const;

type Props = {
  onContinueToDashboard: () => void;
};

export function VerificationSuccessVvipCard({ onContinueToDashboard }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.55, ease: "easeOut" }}
      className="mt-8 text-left"
    >
      <div className="glass-gold rounded-xl p-5 sm:p-6 relative overflow-hidden shadow-luxury">
        <div className="absolute inset-x-0 top-0 h-px hairline-gold" />

        <p className="text-[10px] tracking-[0.3em] text-gold uppercase">VVIP Access</p>
        <h2 className="mt-2 font-display text-xl sm:text-2xl text-foreground leading-tight">
          Access Your VVIP Community
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Congratulations. Your Pocket Option account has been verified successfully. You now qualify
          for access to the CashoutFX VVIP Telegram community.
        </p>

        <ul className="mt-5 space-y-2.5">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-sm text-foreground">
              <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" strokeWidth={2.5} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={VVIP_TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-lg bg-gradient-gold px-5 py-3 text-sm font-semibold tracking-[0.2em] text-primary-foreground shadow-gold-glow hover:scale-[1.01] active:scale-[0.99] transition-all text-center"
          >
            JOIN VVIP TELEGRAM
          </a>
          <LuxButton variant="ghost" onClick={onContinueToDashboard}>
            CONTINUE TO DASHBOARD
          </LuxButton>
        </div>
      </div>
    </motion.div>
  );
}
