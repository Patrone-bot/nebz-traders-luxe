import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  step?: { current: number; total: number; label?: string };
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ step, eyebrow, title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <img
            src="/__l5e/assets-v1/492d0329-bc4e-4e2f-bb71-8c2c5bcf81f6/cashoutfx-logo.png"
            alt="CashoutFX"
            className="h-8 w-8 rounded-full object-cover object-top"
          />
          <span className="font-display tracking-[0.3em] text-gradient-gold">CashoutFX</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="glass shadow-luxury rounded-2xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px hairline-gold" />

            {step && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                  <span>{step.label ?? "Onboarding"}</span>
                  <span>Step {step.current} of {step.total}</span>
                </div>
                <div className="mt-2 h-[3px] bg-secondary/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(step.current / step.total) * 100}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="h-full bg-gradient-gold"
                  />
                </div>
              </div>
            )}

            {eyebrow && (
              <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3">{eyebrow}</p>
            )}
            <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight">{title}</h1>
            {subtitle && <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>}

            <div className="mt-8">{children}</div>

            {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
          </div>
          <p className="mt-6 text-center text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            Encrypted · Private · Secure
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function LuxField({
  label, type = "text", placeholder, name, value, onChange, autoComplete,
}: {
  label: string; type?: string; placeholder?: string; name: string;
  value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-2">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="w-full rounded-lg bg-input/40 border border-border/70 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
      />
    </label>
  );
}

export function LuxButton({
  children, type = "button", onClick, variant = "primary", disabled,
}: {
  children: ReactNode; type?: "button" | "submit"; onClick?: () => void;
  variant?: "primary" | "ghost"; disabled?: boolean;
}) {
  if (variant === "ghost") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="w-full rounded-lg border border-border/70 bg-secondary/40 px-5 py-3 text-sm font-semibold tracking-[0.2em] text-foreground hover:bg-secondary/70 transition-all"
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-lg bg-gradient-gold px-5 py-3 text-sm font-semibold tracking-[0.2em] text-primary-foreground shadow-gold-glow hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
