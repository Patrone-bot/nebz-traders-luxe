const CHECK_BALANCE_URL =
  "https://tradersmarketsplace.com/check-marketplace-balance.php";

const INTERNAL_KEY = "xK9pL2vQ8mR5tY7wZ3nB6cF1jH4sD0aE";

const REQUEST_TIMEOUT_MS = 30_000;

export const TRADERS_MARKETPLACE_URLS = {
  register: "https://tradersmarketsplace.com/register",
  deposit: "https://tradersmarketsplace.com/deposit.php",
  automatedTrading: "https://tradersmarketsplace.com/automated-trading.php",
  courses: "https://tradersmarketsplace.com/marketplace?type=courses",
  mentors: "https://tradersmarketsplace.com/mentors.php",
  aiStudio: "https://tradersmarketsplace.com/ai-studio.php",
} as const;

export const AI_SIGNALS_REQUIRED_AMOUNT = 1800;

export type MarketplaceBalanceApiResponse = {
  success: boolean;
  message?: string;
  hasAccount?: boolean;
  isActive?: boolean;
  hasSufficientBalance?: boolean;
  currentBalance?: number;
  requiredBalance?: number;
  remainingAmount?: number;
};

export type CheckMarketplaceBalanceResult =
  | { status: "success"; data: MarketplaceBalanceApiResponse }
  | { status: "no_account" }
  | { status: "inactive" }
  | { status: "insufficient_balance"; currentBalance: number; requiredBalance: number; remainingAmount: number }
  | { status: "verified" }
  | { status: "error"; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseBalanceResponse(payload: unknown): MarketplaceBalanceApiResponse | null {
  if (!isRecord(payload) || typeof payload.success !== "boolean") {
    return null;
  }

  return {
    success: payload.success,
    message: typeof payload.message === "string" ? payload.message : undefined,
    hasAccount: typeof payload.hasAccount === "boolean" ? payload.hasAccount : undefined,
    isActive: typeof payload.isActive === "boolean" ? payload.isActive : undefined,
    hasSufficientBalance:
      typeof payload.hasSufficientBalance === "boolean" ? payload.hasSufficientBalance : undefined,
    currentBalance: typeof payload.currentBalance === "number" ? payload.currentBalance : undefined,
    requiredBalance: typeof payload.requiredBalance === "number" ? payload.requiredBalance : undefined,
    remainingAmount: typeof payload.remainingAmount === "number" ? payload.remainingAmount : undefined,
  };
}

function toCheckResult(data: MarketplaceBalanceApiResponse): CheckMarketplaceBalanceResult {
  if (!data.success) {
    return {
      status: "error",
      message: data.message?.trim() || "Unable to verify your account. Please try again.",
    };
  }

  if (data.hasAccount === false) {
    return { status: "no_account" };
  }

  if (data.isActive === false) {
    return { status: "inactive" };
  }

  if (data.hasSufficientBalance === true) {
    return { status: "verified" };
  }

  if (data.hasSufficientBalance === false) {
    const currentBalance = data.currentBalance ?? 0;
    const requiredBalance = data.requiredBalance ?? AI_SIGNALS_REQUIRED_AMOUNT;
    const remainingAmount =
      data.remainingAmount ?? Math.max(requiredBalance - currentBalance, 0);

    return {
      status: "insufficient_balance",
      currentBalance,
      requiredBalance,
      remainingAmount,
    };
  }

  return {
    status: "error",
    message: data.message?.trim() || "Unexpected response from verification service.",
  };
}

export async function checkMarketplaceBalance(
  displayId: string,
  requiredAmount: number = AI_SIGNALS_REQUIRED_AMOUNT,
): Promise<CheckMarketplaceBalanceResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(CHECK_BALANCE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Key": INTERNAL_KEY,
      },
      body: JSON.stringify({ displayId, requiredAmount }),
      signal: controller.signal,
    });

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return {
        status: "error",
        message: "Invalid response from verification service. Please try again.",
      };
    }

    const parsed = parseBalanceResponse(payload);
    if (!parsed) {
      return {
        status: "error",
        message: "Unexpected response from verification service. Please try again.",
      };
    }

    return toCheckResult(parsed);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        status: "error",
        message: "Request timed out. Please try again.",
      };
    }

    return {
      status: "error",
      message: "Network error. Please check your connection and try again.",
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
