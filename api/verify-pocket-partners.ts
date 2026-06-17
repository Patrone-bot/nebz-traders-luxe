import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

type VercelRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: string | Record<string, unknown>;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

type VerifyRequestBody = {
  verificationRequestId?: string;
  traderId?: string;
};

function readEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getBearerToken(req: VercelRequest): string | null {
  const header = req.headers.authorization ?? req.headers.Authorization;
  const value = Array.isArray(header) ? header[0] : header;
  if (!value?.startsWith("Bearer ")) return null;
  return value.slice("Bearer ".length).trim() || null;
}

function parseBody(req: VercelRequest): VerifyRequestBody {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body) as VerifyRequestBody;
  }
  return req.body as VerifyRequestBody;
}

function buildPartnerHash(traderId: string, partnerId: string, token: string): string {
  return createHash("md5").update(`${traderId}:${partnerId}:${token}`).digest("hex");
}

function hasUid(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    "uid" in data &&
    (data as { uid?: unknown }).uid !== null &&
    (data as { uid?: unknown }).uid !== undefined
  );
}

function isAccessDenied(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false;
  const record = data as Record<string, unknown>;
  return record.status_code === 403 && record.error === true && record.message === "access denied";
}

async function fetchPartnerInfo(
  traderId: string,
  partnerId: string,
  token: string,
): Promise<unknown> {
  const hash = buildPartnerHash(traderId, partnerId, token);
  const url = `https://pocketpartners.com/api/user-info/${encodeURIComponent(traderId)}/${encodeURIComponent(partnerId)}/${hash}`;
  const response = await fetch(url);

  try {
    return await response.json();
  } catch {
    return {
      error: true,
      status_code: response.status,
      message: "Invalid PocketPartners response",
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const accessToken = getBearerToken(req);
    if (!accessToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const body = parseBody(req);
    const verificationRequestId = body.verificationRequestId?.trim();
    const traderId = body.traderId?.trim();

    if (!verificationRequestId || !traderId) {
      return res.status(400).json({ success: false, message: "Missing verificationRequestId or traderId" });
    }

    const supabaseUrl = readEnv("SUPABASE_URL");
    const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { data: verificationRequest, error: verificationError } = await supabaseAdmin
      .from("verification_requests")
      .select("id, user_id, pocket_trader_id")
      .eq("id", verificationRequestId)
      .maybeSingle();

    if (verificationError) {
      return res.status(500).json({ success: false, message: verificationError.message });
    }

    if (!verificationRequest) {
      return res.status(404).json({ success: false, message: "Verification request not found" });
    }

    if (verificationRequest.user_id !== user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    if (verificationRequest.pocket_trader_id !== traderId) {
      return res.status(400).json({ success: false, message: "Trader ID mismatch" });
    }

    const nebzResponse = await fetchPartnerInfo(
      traderId,
      readEnv("POCKET_NEBZ_PARTNER_ID"),
      readEnv("POCKET_NEBZ_TOKEN"),
    );

    if (hasUid(nebzResponse)) {
      const verifiedAt = new Date().toISOString();
      const verificationMessage = "Verified under Nebz";

      const { error: updateError } = await supabaseAdmin
        .from("verification_requests")
        .update({
          verification_status: "verified",
          verified_under: "Nebz",
          verified_at: verifiedAt,
          partner_response: nebzResponse,
          verification_message: verificationMessage,
        })
        .eq("id", verificationRequestId);

      if (updateError) {
        return res.status(500).json({ success: false, message: updateError.message });
      }

      return res.status(200).json({
        success: true,
        verified: true,
        verifiedUnder: "Nebz",
        message: verificationMessage,
      });
    }

    const shouldCheckNyathira = isAccessDenied(nebzResponse) || !hasUid(nebzResponse);
    let nyathiraResponse: unknown = null;

    if (shouldCheckNyathira) {
      nyathiraResponse = await fetchPartnerInfo(
        traderId,
        readEnv("POCKET_NYATHIRA_PARTNER_ID"),
        readEnv("POCKET_NYATHIRA_TOKEN"),
      );

      if (hasUid(nyathiraResponse)) {
        const verifiedAt = new Date().toISOString();
        const verificationMessage = "Verified under Nyathira";

        const { error: updateError } = await supabaseAdmin
          .from("verification_requests")
          .update({
            verification_status: "verified",
            verified_under: "Nyathira",
            verified_at: verifiedAt,
            partner_response: nyathiraResponse,
            verification_message: verificationMessage,
          })
          .eq("id", verificationRequestId);

        if (updateError) {
          return res.status(500).json({ success: false, message: updateError.message });
        }

        return res.status(200).json({
          success: true,
          verified: true,
          verifiedUnder: "Nyathira",
          message: verificationMessage,
        });
      }
    }

    const verifiedAt = new Date().toISOString();
    const verificationMessage = "Trader ID not found under Nebz or Nyathira";

    const { error: rejectError } = await supabaseAdmin
      .from("verification_requests")
      .update({
        verification_status: "rejected",
        verified_under: null,
        verified_at: verifiedAt,
        partner_response: null,
        verification_message: verificationMessage,
      })
      .eq("id", verificationRequestId);

    if (rejectError) {
      return res.status(500).json({ success: false, message: rejectError.message });
    }

    return res.status(200).json({
      success: false,
      verified: false,
      message: verificationMessage,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return res.status(500).json({ success: false, message });
  }
}
