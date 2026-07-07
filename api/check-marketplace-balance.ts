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

type CheckBalanceRequestBody = {
  displayId?: string;
  requiredAmount?: number;
};

const UPSTREAM_URL = "https://tradersmarketsplace.com/check-marketplace-balance.php";
const DEFAULT_REQUIRED_AMOUNT = 1800;

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

function parseBody(req: VercelRequest): CheckBalanceRequestBody {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body) as CheckBalanceRequestBody;
  }
  return req.body as CheckBalanceRequestBody;
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

    const body = parseBody(req);
    const displayId = body.displayId?.trim();
    const requiredAmount =
      typeof body.requiredAmount === "number" && Number.isFinite(body.requiredAmount)
        ? body.requiredAmount
        : DEFAULT_REQUIRED_AMOUNT;

    if (!displayId || !/^\d+$/.test(displayId)) {
      return res.status(400).json({ success: false, message: "Invalid displayId" });
    }

    const internalKey = readEnv("TRADERS_MARKETPLACE_INTERNAL_KEY");

    const upstreamResponse = await fetch(UPSTREAM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Key": internalKey,
      },
      body: JSON.stringify({ displayId, requiredAmount }),
    });

    let payload: unknown;
    try {
      payload = await upstreamResponse.json();
    } catch {
      return res.status(502).json({
        success: false,
        message: "Invalid response from marketplace verification service.",
      });
    }

    return res.status(upstreamResponse.ok ? 200 : upstreamResponse.status).json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return res.status(500).json({ success: false, message });
  }
}
