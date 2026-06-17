import { getLatestPendingPackageRequest } from "@/lib/supabase/package-requests";
import { supabase } from "@/lib/supabase/client";

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
  | { ok: false; message: string };

export async function submitExistingAccountVerification(
  userId: string,
  pocketTraderId: string,
): Promise<SubmitVerificationResult> {
  const trimmedId = pocketTraderId.trim();
  if (!trimmedId) {
    return { ok: false, message: "Pocket Trader ID is required." };
  }

  const { data: packageRequest, error: packageError } =
    await getLatestPendingPackageRequest(userId);

  if (packageError) {
    return { ok: false, message: packageError.message };
  }

  if (!packageRequest) {
    return {
      ok: false,
      message: "No pending package request found. Please select a package first.",
    };
  }

  const { error: insertError } = await createVerificationRequest({
    user_id: userId,
    package_request_id: packageRequest.id,
    pocket_trader_id: trimmedId,
  });

  if (insertError) {
    return { ok: false, message: insertError.message };
  }

  return { ok: true };
}
