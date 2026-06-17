import { getLatestPendingPackageRequest } from "@/lib/supabase/package-requests";
import { supabase } from "@/lib/supabase/client";

export const REFERRER_REDIRECT_URLS = {
  Nebz: "https://u3.shortink.io/smart/nhB6IBAYZrpArV",
  Nyathira: "https://u3.shortink.io/smart/NLW5xrgmTFAC8V",
} as const;

export type SelectedReferrer = keyof typeof REFERRER_REDIRECT_URLS;

export async function createReferralRedirect(input: {
  user_id: string;
  package_request_id: string;
  selected_referrer: SelectedReferrer;
}) {
  return supabase.from("referral_redirects").insert({
    user_id: input.user_id,
    package_request_id: input.package_request_id,
    selected_referrer: input.selected_referrer,
  });
}

export type SubmitReferralRedirectResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; message: string };

export async function submitReferralRedirect(
  userId: string,
  selectedReferrer: SelectedReferrer,
): Promise<SubmitReferralRedirectResult> {
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

  const { error: insertError } = await createReferralRedirect({
    user_id: userId,
    package_request_id: packageRequest.id,
    selected_referrer: selectedReferrer,
  });

  if (insertError) {
    return { ok: false, message: insertError.message };
  }

  return { ok: true, redirectUrl: REFERRER_REDIRECT_URLS[selectedReferrer] };
}
