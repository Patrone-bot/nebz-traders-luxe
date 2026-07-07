import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LogOut, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { AuthSessionLoader } from "@/components/AuthSessionLoader";
import { isAdminEmail } from "@/lib/auth/admin";
import { supabase } from "@/lib/supabase/client";
import { fetchProfile } from "@/lib/supabase/profiles";
import { BrandLogo } from "@/components/BrandLogo";
import { MarketplaceCard } from "@/components/MarketplaceCard";
import { MarketplaceVerificationModal } from "@/components/MarketplaceVerificationModal";
import { MARKETPLACE_PRODUCTS, type MarketplaceProduct } from "@/lib/marketplace-products";
import { openMarketplaceUrl } from "@/lib/api/tradersMarketplace";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CashoutFX" }, NOINDEX_ROBOTS] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useRequireAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

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

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  const handleProductAction = (product: MarketplaceProduct) => {
    if (product.action.type === "modal") {
      setVerificationModalOpen(true);
      return;
    }

    openMarketplaceUrl(product.action.url);
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
          <p className="mt-6 max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed">
            Your member portal connects you to curated trading education, private mentorship, and
            AI-powered automation through the TradersMarketsPlace ecosystem. Review the options
            below and choose the path that best matches your goals — each selection opens in a new
            tab so you can return here at any time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="max-w-6xl mx-auto mb-8 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl text-foreground">
            Choose Your <span className="italic text-gradient-gold">Next Step</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Select one product below to continue your journey.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-6">
          {MARKETPLACE_PRODUCTS.map((product, index) => (
            <MarketplaceCard
              key={product.id}
              product={product}
              index={index}
              onAction={handleProductAction}
              disabled={verificationModalOpen}
            />
          ))}
        </div>
      </main>

      <MarketplaceVerificationModal
        open={verificationModalOpen}
        onOpenChange={setVerificationModalOpen}
      />
    </div>
  );
}
