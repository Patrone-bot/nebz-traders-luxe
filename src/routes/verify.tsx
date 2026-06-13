import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, X, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Verify Account — NEBZ" }] }),
  component: Verify,
});

function Verify() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-6 max-w-7xl mx-auto w-full">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground hover:text-gold uppercase">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to packages
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl text-center"
        >
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-3">Verification</p>
          <h1 className="font-display text-4xl sm:text-5xl text-foreground">
            Do you already have an <span className="italic text-gradient-gold">account with us?</span>
          </h1>
          <p className="mt-4 text-muted-foreground">Select an option to continue.</p>

          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            <motion.button
              whileHover={{ y: -4 }}
              onClick={() => navigate({ to: "/verify-existing" })}
              className="group glass shadow-luxury rounded-2xl p-10 hover:border-gold/60 transition-all"
            >
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold-glow">
                <Check className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="mt-6 font-display text-3xl text-foreground">YES</h3>
              <p className="mt-2 text-sm text-muted-foreground">I have a Pocket Option account.</p>
            </motion.button>

            <motion.button
              whileHover={{ y: -4 }}
              onClick={() => navigate({ to: "/verify-new" })}
              className="group glass shadow-luxury rounded-2xl p-10 hover:border-gold/60 transition-all"
            >
              <div className="h-16 w-16 mx-auto rounded-2xl glass-gold flex items-center justify-center">
                <X className="h-7 w-7 text-gold" />
              </div>
              <h3 className="mt-6 font-display text-3xl text-foreground">NO</h3>
              <p className="mt-2 text-sm text-muted-foreground">I need to create a new account.</p>
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
