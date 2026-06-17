export type PocketPartnersVerifyResponse = {
  success: boolean;
  verified?: boolean;
  verifiedUnder?: "Nebz" | "Nyathira";
  message: string;
};

export async function callVerifyPocketPartners(
  verificationRequestId: string,
  traderId: string,
  accessToken: string,
): Promise<PocketPartnersVerifyResponse> {
  const response = await fetch("/api/verify-pocket-partners", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ verificationRequestId, traderId }),
  });

  const payload = (await response.json()) as PocketPartnersVerifyResponse;

  if (!response.ok && !payload.message) {
    return {
      success: false,
      verified: false,
      message: "Verification service unavailable. Please try again.",
    };
  }

  return payload;
}
