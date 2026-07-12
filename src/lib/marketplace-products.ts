import type { LucideIcon } from "lucide-react";
import { Bot, Gem, GraduationCap, Rocket } from "lucide-react";
import { TRADERS_MARKETPLACE_URLS } from "@/lib/api/tradersMarketplace";

export type MarketplaceProductAction =
  | { type: "redirect"; url: string }
  | { type: "modal" };

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
};

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: "formula",
    title: "💎 $500 – Get the Almighty Formula",
    description:
      "The secret that can turn your small account into a life-changing opportunity.\n\nIt worked for me, and it's already helped thousands of others who decided to take action.\n\nIn less than 13 minutes, you'll gain the insights you need to get started on a journey that could change your financial future.\n\nDon't miss your chance—your next big opportunity could begin today.",
    action: { type: "redirect", url: TRADERS_MARKETPLACE_URLS.courses },
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
    id: "mentorship",
    title: "🎓 $1,000 – 1-on-1 Private Mentorship",
    description:
      "Discover how to know when to buy and when to sell with confidence 88%+ accuracy.\n\nLearn how trading signals really work, then use that knowledge to build your own AI trading bot that generates buy and sell signals for you.\n\nBest approach for lifetime consistent earnings.",
    action: { type: "redirect", url: TRADERS_MARKETPLACE_URLS.mentors },
    theme: {
      badge: "Limited Slots",
      icon: GraduationCap,
      cardClass: "border-violet-500/20 hover:border-violet-400/40",
      glowClass: "bg-violet-500/10 group-hover:bg-violet-500/20",
      iconWrapClass: "border border-violet-400/30 bg-violet-500/10",
      iconClass: "text-violet-300",
      badgeClass: "border-violet-400/30 bg-violet-500/10 text-violet-200",
    },
  },
  {
    id: "ai-signals",
    title: "🤖 $1800 – AI Signals",
    description:
      "Fund your trading account with $1800 and let the most advanced Binary AI do the heavy lifting on your behalf.\n\nSimply feed the AI's trades while keeping full control of your account.",
    action: { type: "modal" },
    theme: {
      badge: "Requires Marketplace Account",
      icon: Bot,
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
    action: { type: "redirect", url: TRADERS_MARKETPLACE_URLS.aiStudio },
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
];
