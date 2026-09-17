import { supabase } from "@/lib/supabase/client";

const REQUEST_TIMEOUT_MS = 30_000;

export const VIP_SIGNALS_REQUIRED_AMOUNT = 500;
export const VIP_TELEGRAM_URL = "https://t.me/+SOCcODJAwb9kOTlk";

export const Y2_MARKETPLACE_URLS = {
  dashboard: "https://y2markets.com/",
  signupDon01: "https://y2markets.com/landing.php?open=signup&ref=Don01",
  signupNyathira: "https://y2markets.com/landing.php?open=signup&ref=nyathira",
} as const;

export type Y2DepositApiResponse = {
  success: boolean;
  status?: "verified" | "insufficient_balance" | "no_account";
  message?: string;
  confirmedDeposits?: number;
  requiredAmount?: number;
  remainingAmount?: number;
};

export type CheckY2DepositResult =
  | { status: "verified" }
  | { status: "no_account" }
  | {
      status: "insufficient_balance";
      confirmedDeposits: number;
      requiredAmount: number;
      remainingAmount: number;
    }
  | { status: "error"; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toCheckResult(data: Y2DepositApiResponse): CheckY2DepositResult {
  if (!data.success) {
    return {
      status: "error",
      message: data.message?.trim() || "Unable to verify your deposit. Please try again.",
    };
  }

  switch (data.status) {
    case "verified":
      return { status: "verified" };
    case "no_account":
      return { status: "no_account" };
    case "insufficient_balance": {
      const requiredAmount = data.requiredAmount ?? VIP_SIGNALS_REQUIRED_AMOUNT;
      const confirmedDeposits = data.confirmedDeposits ?? 0;
      return {
        status: "insufficient_balance",
        confirmedDeposits,
        requiredAmount,
        remainingAmount: data.remainingAmount ?? Math.max(requiredAmount - confirmedDeposits, 0),
      };
    }
    default:
      return {
        status: "error",
        message: data.message?.trim() || "Unexpected response from the verification service.",
      };
  }
}

export async function checkY2Deposit(
  username: string,
  requiredAmount: number = VIP_SIGNALS_REQUIRED_AMOUNT,
): Promise<CheckY2DepositResult> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("/api/check-y2-deposit", {
      method: "POST",
      headers,
      body: JSON.stringify({ username, requiredAmount }),
      signal: controller.signal,
    });

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return {
        status: "error",
        message: "Invalid response from the verification service. Please try again.",
      };
    }

    if (!isRecord(payload) || typeof payload.success !== "boolean") {
      return {
        status: "error",
        message: "Unexpected response from the verification service. Please try again.",
      };
    }

    const data = payload as unknown as Y2DepositApiResponse;

    if (!response.ok && data.success === false) {
      return toCheckResult(data);
    }

    if (!response.ok) {
      return {
        status: "error",
        message:
          data.message?.trim() ||
          "Verification service unavailable. Please try again.",
      };
    }

    return toCheckResult(data);
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
