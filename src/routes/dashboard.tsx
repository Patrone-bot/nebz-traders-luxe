import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Sparkles, Bot, Crown, Copy, ArrowRight, LogOut, Loader2, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { AuthSessionLoader } from "@/components/AuthSessionLoader";
import { isAdminEmail } from "@/lib/auth/admin";
import { supabase } from "@/lib/supabase/client";
import { fetchProfile } from "@/lib/supabase/profiles";import { requestPackage } from "@/lib/supabase/package-requests";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CashoutFX" }] }),
  component: Dashboard,
});

const packages = [
  {
    id: "ai",
    title: "Deposit $500",
    subtitle: "AI Signals",
    benefit: "Free AI Signals",
    icon: Bot,
    features: [
      "AI-powered market analysis",
      "Daily trading signals",
      "Entry & risk guidance",
      "Private signal community",
    ],
    featured: false,
  },
  {
    id: "vvip",
    title: "Deposit $1,800",
    subtitle: "VVIP Access",
    benefit: "Free VVIP Access",
    icon: Crown,
    features: [
      "High-probability confirmed setups",
      "Premium signals with deeper analysis",
      "One-on-one trading mentorship",
      "Live VIP trading sessions",
    ],
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
  const { user, loading } = useRequireAuth();
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let mounted = true;
    fetchProfile(user.id).then(({ data }) => {
      if (!mounted) return;
      setDisplayName(data?.full_name?.trim() || user.email || "Member");
    });

    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading || !user) return <AuthSessionLoader />;

  const onSelect = async (id: string) => {
    setError(null);

    if (!user) {
      setError("Please sign in to select a package.");
      return;
    }

    setSelectingId(id);

    const result = await requestPackage(user.id, id);

    setSelectingId(null);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    try {
      sessionStorage.setItem("nebz_package", id);
    } catch {
      // ignore storage failures
    }
    navigate({ to: "/verify" });
  };
  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen">
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <BrandLogo variant="standard" />
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground hover:text-gold uppercase"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
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
            Welcome back,{" "}
            <span className="italic text-gradient-gold">{displayName ?? "Member"}</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{user.email}</p>
          {isAdminEmail(user.email) && (
            <div className="mt-4">
              <Link
                to="/admin"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-5 py-2.5 text-xs font-semibold tracking-[0.2em] text-foreground hover:border-gold/60 uppercase transition-all"
              >
                <Shield className="h-3.5 w-3.5 text-gold" />
                Admin Console
              </Link>
            </div>
          )}
          <p className="mt-4 text-muted-foreground">
            Choose the experience that matches your goals. Don&apos;t pay anything, just deposit. Your trading account pays us after profits and excellence.
          </p>
          {error && <p className="mt-4 text-xs text-destructive">{error}</p>}
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
                      type="button"
                      onClick={() => onSelect(p.id)}
                      disabled={selectingId !== null}
                      className={`mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold tracking-[0.3em] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        p.featured
                          ? "bg-gradient-gold text-primary-foreground shadow-gold-glow hover:scale-[1.02]"
                          : "border border-border/70 bg-secondary/40 text-foreground hover:border-gold/60"
                      }`}
                    >
                      {selectingId === p.id ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          PROCESSING
                        </>
                      ) : (
                        <>
                          GET ACCESS
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
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
