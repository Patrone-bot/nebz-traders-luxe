import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Sparkles, Bot, Crown, Copy, ArrowRight, LogOut } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NEBZ" }] }),
  component: Dashboard,
});

const packages = [
  {
    id: "ai",
    title: "Deposit $500",
    subtitle: "AI Signals",
    benefit: "Free AI Signals",
    icon: Bot,
    features: ["Daily AI-curated setups", "Real-time alerts", "Risk-scored entries", "Community channel access"],
    featured: false,
  },
  {
    id: "vvip",
    title: "Deposit $1,800",
    subtitle: "VVIP Access",
    benefit: "Free VVIP Access",
    icon: Crown,
    features: ["Everything in AI Signals", "Live VVIP trade room", "Weekly 1:1 strategy review", "Priority concierge support"],
    featured: true,
  },
  {
    id: "copy",
    title: "Deposit $3,500",
    subtitle: "Copy Trading",
    benefit: "Copy Trading",
    icon: Copy,
    features: ["Auto-mirror Nebz's trades", "Institutional risk controls", "Quarterly portfolio review", "Founders' inner circle"],
    featured: false,
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const onSelect = (id: string) => {
    try { sessionStorage.setItem("nebz_package", id); } catch {}
    navigate({ to: "/verify" });
  };

  return (
    <div className="min-h-screen">
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-gold flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">N</span>
          </div>
          <span className="font-display tracking-[0.3em] text-gradient-gold">NEBZ</span>
        </Link>
        <Link to="/login" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground hover:text-gold uppercase">
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Link>
      </header>

      <main className="px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mt-8 mb-14"
        >
          <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-3">Member Dashboard</p>
          <h1 className="font-display text-5xl sm:text-6xl text-foreground">
            Welcome <span className="italic text-gradient-gold">Back.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Choose the experience that matches your goals.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          {packages.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative group ${p.featured ? "lg:-mt-4 lg:mb-4" : ""}`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="inline-flex items-center gap-1.5 bg-gradient-gold rounded-full px-4 py-1 text-[10px] font-bold tracking-[0.25em] text-primary-foreground shadow-gold-glow">
                      <Sparkles className="h-3 w-3" /> MOST POPULAR
                    </div>
                  </div>
                )}
                <div className={`relative h-full rounded-3xl p-8 shadow-luxury transition-all overflow-hidden ${
                  p.featured ? "glass-gold border-gold/40 hover:scale-[1.02]" : "glass hover:border-gold/40 hover:-translate-y-1"
                }`}>
                  <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gold/10 blur-2xl group-hover:bg-gold/20 transition-colors" />
                  <div className="relative">
                    <div className="h-14 w-14 rounded-2xl glass-gold flex items-center justify-center mb-6">
                      <Icon className="h-6 w-6 text-gold" />
                    </div>
                    <p className="text-[10px] tracking-[0.3em] text-gold uppercase">{p.subtitle}</p>
                    <h3 className="mt-2 font-display text-4xl text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.benefit}</p>

                    <ul className="mt-6 space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm text-foreground/85">
                          <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => onSelect(p.id)}
                      className={`mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold tracking-[0.3em] transition-all ${
                        p.featured
                          ? "bg-gradient-gold text-primary-foreground shadow-gold-glow hover:scale-[1.02]"
                          : "border border-border/70 bg-secondary/40 text-foreground hover:border-gold/60"
                      }`}
                    >
                      GET ACCESS
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
