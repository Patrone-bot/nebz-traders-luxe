import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { BRAND_NAME, BRANDING } from "@/lib/branding";

type BrandLogoVariant = "nav" | "standard" | "footer";

const VARIANT_STYLES: Record<
  BrandLogoVariant,
  { image: string; wordmark: string; imageWidth: number; imageHeight: number }
> = {
  nav: {
    image: "h-12 w-12 sm:h-14 sm:w-14 object-contain",
    wordmark: "text-base sm:text-xl font-semibold tracking-[0.25em] text-gradient-gold",
    imageWidth: 56,
    imageHeight: 56,
  },
  standard: {
    image: "h-12 w-12 object-contain",
    wordmark: "font-display text-lg tracking-[0.25em] text-gradient-gold",
    imageWidth: 48,
    imageHeight: 48,
  },
  footer: {
    image: "h-12 w-12 object-contain",
    wordmark: "font-display text-xl tracking-[0.25em] text-gradient-gold",
    imageWidth: 48,
    imageHeight: 48,
  },
};

type Props = {
  variant?: BrandLogoVariant;
  to?: "/" | false;
  className?: string;
};

export function BrandLogo({ variant = "standard", to = "/", className }: Props) {
  const styles = VARIANT_STYLES[variant];

  const content = (
    <>
      <img
        src={BRANDING.logo}
        alt={BRAND_NAME}
        width={styles.imageWidth}
        height={styles.imageHeight}
        className={styles.image}
        decoding="async"
      />
      <span className={cn("font-display", styles.wordmark)}>{BRAND_NAME}</span>
    </>
  );

  const classes = cn("flex items-center gap-3 group", className);

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
