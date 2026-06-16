import { getLatestPendingPackageRequest } from "@/lib/supabase/package-requests";
import { supabase } from "@/lib/supabase/client";

export async function findPendingVerificationForPackageRequest(packageRequestId: string) {
  return supabase
    .from("verification_requests")
    .select("id")
    .eq("package_request_id", packageRequestId)
    .eq("verification_status", "pending")
    .maybeSingle();
}

export async function createVerificationRequest(input: {
  user_id: string;
  package_request_id: string;
  pocket_trader_id: string;
}) {
  return supabase.from("verification_requests").insert({
    user_id: input.user_id,
    package_request_id: input.package_request_id,
    pocket_trader_id: input.pocket_trader_id,
    verification_status: "pending",
  });
}

export type SubmitVerificationResult =
  | { ok: true }
  | { ok: false; kind: "duplicate" | "error"; message: string };

export async function submitExistingAccountVerification(
  userId: string,
  pocketTraderId: string,
): Promise<SubmitVerificationResult> {
  const trimmedId = pocketTraderId.trim();
  if (!trimmedId) {
    return { ok: false, kind: "error", message: "Pocket Trader ID is required." };
  }

  const { data: packageRequest, error: packageError } =
    await getLatestPendingPackageRequest(userId);

  if (packageError) {
    return { ok: false, kind: "error", message: packageError.message };
  }

  if (!packageRequest) {
    return {
      ok: false,
      kind: "error",
      message: "No pending package request found. Please select a package first.",
    };
  }

  const { data: existing, error: lookupError } =
    await findPendingVerificationForPackageRequest(packageRequest.id);

  if (lookupError) {
    return { ok: false, kind: "error", message: lookupError.message };
  }

  if (existing) {
    return {
      ok: false,
      kind: "duplicate",
      message: "You already have a pending verification request for this package.",
    };
  }

  const { error: insertError } = await createVerificationRequest({
    user_id: userId,
    package_request_id: packageRequest.id,
    pocket_trader_id: trimmedId,
  });

  if (insertError) {
    return { ok: false, kind: "error", message: insertError.message };
  }

  return { ok: true };
}
