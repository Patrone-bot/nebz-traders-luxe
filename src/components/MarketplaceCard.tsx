import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import type { MarketplaceProduct } from "@/lib/marketplace-products";

type Props = {
  product: MarketplaceProduct;
  index: number;
  onAction: (product: MarketplaceProduct) => void;
  loading?: boolean;
  disabled?: boolean;
};

export function MarketplaceCard({ product, index, onAction, loading, disabled }: Props) {
  const Icon = product.theme.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="relative group h-full"
    >
      <div
        className={`relative h-full rounded-3xl border p-8 shadow-luxury transition-all overflow-hidden glass hover:-translate-y-1 ${product.theme.cardClass}`}
      >
        <div
          className={`absolute -top-16 -right-16 h-40 w-40 rounded-full blur-2xl transition-colors ${product.theme.glowClass}`}
        />
        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <div
              className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${product.theme.iconWrapClass}`}
            >
              <Icon className={`h-5 w-5 ${product.theme.iconClass}`} />
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase ${product.theme.badgeClass}`}
            >
              {product.theme.badge}
            </span>
          </div>

          <h3 className="mt-5 font-display text-2xl sm:text-3xl text-foreground leading-tight">
            {product.title}
          </h3>

          <div className="mt-5 space-y-4 flex-1">
            {product.description.split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-sm text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onAction(product)}
            disabled={disabled || loading}
            className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-6 py-3.5 text-xs font-semibold tracking-[0.3em] text-foreground hover:border-gold/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                PROCESSING
              </>
            ) : (
              <>
                GET IT NOW
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
