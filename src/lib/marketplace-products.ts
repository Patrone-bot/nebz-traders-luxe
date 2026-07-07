import { TRADERS_MARKETPLACE_URLS } from "@/lib/api/tradersMarketplace";

export type MarketplaceProductAction =
  | { type: "redirect"; url: string }
  | { type: "modal" };

export type MarketplaceProduct = {
  id: string;
  title: string;
  description: string;
  action: MarketplaceProductAction;
};

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: "formula",
    title: "💎 $500 – Get the Almighty Formula",
    description:
      "The secret that can turn your small account into a life-changing opportunity.\n\nIt worked for me, and it's already helped thousands of others who decided to take action.\n\nIn less than 13 minutes, you'll gain the insights you need to get started on a journey that could change your financial future.\n\nDon't miss your chance—your next big opportunity could begin today.",
    action: { type: "redirect", url: TRADERS_MARKETPLACE_URLS.courses },
  },
  {
    id: "mentorship",
    title: "🎓 $1,000 – 1-on-1 Private Mentorship",
    description:
      "Receive personalized coaching and a complete step-by-step blueprint.\n\nI'll teach you the exact formula and best approach that has consistently worked for many successful traders including us.",
    action: { type: "redirect", url: TRADERS_MARKETPLACE_URLS.mentors },
  },
  {
    id: "ai-signals",
    title: "🤖 $1800 – AI Signals",
    description:
      "Fund your trading account with $1800 and let the most advanced Binary AI do the heavy lifting on your behalf.\n\nSimply feed the AI's trades while keeping full control of your account.",
    action: { type: "modal" },
  },
  {
    id: "bi-lord",
    title: "🚀 From $3500 – Own Your BI Lord AI",
    description:
      "Get your own BI Lord AI and trade on your own terms.\n\nLet AI help you grow your capital while creating a potential source of passive income through automated trading.",
    action: { type: "redirect", url: TRADERS_MARKETPLACE_URLS.aiStudio },
  },
];
