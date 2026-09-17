import type { LucideIcon } from "lucide-react";
import { Briefcase, Gem, Rocket, Sparkles, Users } from "lucide-react";
import { TRADERS_MARKETPLACE_URLS } from "@/lib/api/tradersMarketplace";

export type MarketplaceProductAction =
  | { type: "redirect"; url: string }
  | { type: "modal" }
  | { type: "vip-signals" };

export type MarketplaceProductTheme = {
  badge: string;
  icon: LucideIcon;
  cardClass: string;
  glowClass: string;
  iconWrapClass: string;
  iconClass: string;
  badgeClass: string;
};

export type MarketplaceProduct = {
  id: string;
  title: string;
  description: string;
  action: MarketplaceProductAction;
  theme: MarketplaceProductTheme;
  /** Optional YouTube video shown alongside this card's content. */
  videoUrl?: string;
  /** Optional preview image shown on the card, linking to the video. */
  imageUrl?: string;
};

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
   {
    id: "under-500-start",
    title: "if you have less than 500$ to start",
    description:
      "I will teach you everything that helped me level up, completely free, until you become a millionaire.\n\nNo fees, no paid courses, no hidden charges. You walk this path with me step by step, and you only pay me once you are a successful, profitable trader.\n\nStart with whatever you have in your pocket right now. Your success is the only payment I ask for.",
    action: { type: "redirect", url: "https://youtu.be/R6LwzWL1q8c?si=OUylpIZfQL-IKPS3" },
    videoUrl: "https://youtu.be/R6LwzWL1q8c?si=OUylpIZfQL-IKPS3",
    imageUrl: "/images/under-500-thumbnail.jpeg",
    theme: {
      badge: "Instant Access",
      icon: Sparkles,
      cardClass: "border-amber-500/20 hover:border-amber-400/40",
      glowClass: "bg-amber-400/10 group-hover:bg-amber-400/20",
      iconWrapClass: "glass-gold",
      iconClass: "text-gold",
      badgeClass: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    },
  },
  {
    id: "vip-signals",
    title: "💎 $500 – VIP Signals Access",
    description:
      "Once your deposit of $500 or more is confirmed, you are instantly unlocked into our private Telegram VIP signals room, where every high probability setup we take is delivered straight to your phone.\n\nNo Y2 Markets account yet? Create yours under Don01 or nyathira in minutes, deposit $500, and you are in.",
    action: { type: "vip-signals" },
    theme: {
      badge: "Instant Access",
      icon: Gem,
      cardClass: "border-amber-500/20 hover:border-amber-400/40",
      glowClass: "bg-amber-400/10 group-hover:bg-amber-400/20",
      iconWrapClass: "glass-gold",
      iconClass: "text-gold",
      badgeClass: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    },
  },
  {
    id: "copy-trading",
    title: "📈 From $1200 – Copy Trading",
    description:
      "Deposit $1,200 into your Y2 Markets account and let a proven, top ranked trader grow it alongside you.\n\nOnce funded, open Social Trading in your Y2 Markets dashboard, select Top 24h, tap Search and type Don01, then attach your account to copy every trade he makes, automatically and in real time.\n\nYour money never leaves your own account. You stay in full control while the copying does the work.",
    action: { type: "redirect", url: "https://y2markets.com/" },
    theme: {
      badge: "Hands-Free Growth",
      icon: Users,
      cardClass: "border-sky-500/20 hover:border-sky-400/40",
      glowClass: "bg-sky-500/10 group-hover:bg-sky-500/20",
      iconWrapClass: "border border-sky-400/30 bg-sky-500/10",
      iconClass: "text-sky-300",
      badgeClass: "border-sky-400/30 bg-sky-500/10 text-sky-200",
    },
  },
  {
    id: "bi-lord",
    title: "🚀 From $3500 – Own Your BI Lord AI",
    description:
      "Get your own BI Lord AI and trade on your own terms.\n\nLet AI help you grow your capital while creating a potential source of passive income through automated trading.",
    action: { type: "redirect", url: "https://tradersmarketsplace.com/product.php?type=bot&id=589" },
    theme: {
      badge: "Enterprise Solution",
      icon: Rocket,
      cardClass: "border-emerald-500/20 hover:border-emerald-400/40",
      glowClass: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
      iconWrapClass: "border border-emerald-400/30 bg-emerald-500/10",
      iconClass: "text-emerald-300",
      badgeClass: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    },
  },
  {
    id: "account-management",
    title: "💼 From $10,000 – Account Management",
    description:
      "Think of it like a money market, but with better returns and calculated, controlled risk on every single trade.\n\nWe manage your $10,000 account personally, risking only 5% per position so your capital stays protected while it compounds. Every trade is planned, sized and executed with discipline.\n\nYour funds remain in your own Y2 Markets account at all times. We simply put them to work for you.",
    action: { type: "redirect", url: "https://t.me/+nP3Sh4FzmDs5NzQ0" },
    theme: {
      badge: "Fully Managed",
      icon: Briefcase,
      cardClass: "border-violet-500/20 hover:border-violet-400/40",
      glowClass: "bg-violet-500/10 group-hover:bg-violet-500/20",
      iconWrapClass: "border border-violet-400/30 bg-violet-500/10",
      iconClass: "text-violet-300",
      badgeClass: "border-violet-400/30 bg-violet-500/10 text-violet-200",
    },
  },
];
