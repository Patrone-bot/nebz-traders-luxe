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

type CheckY2DepositRequestBody = {
  username?: string;
  requiredAmount?: number;
};

const DEFAULT_Y2_MARKETS_URL = "https://y2markets.com";
const DEFAULT_REQUIRED_AMOUNT = 500;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const rateLimitHits = new Map<string, number[]>();

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"] ?? req.headers["x-real-ip"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitHits.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  recent.push(now);
  rateLimitHits.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

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

function parseBody(req: VercelRequest): CheckY2DepositRequestBody {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body) as CheckY2DepositRequestBody;
  }
  return req.body as CheckY2DepositRequestBody;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const accessToken = getBearerToken(req);
    if (accessToken) {
      try {
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
      } catch {
        // Supabase not configured on this deployment: fall through to the rate-limited anonymous check.
      }
    } else if (isRateLimited(clientIp(req))) {
      return res.status(429).json({
        success: false,
        message: "Too many verification attempts. Please wait a minute and try again.",
      });
    }

    const body = parseBody(req);
    const username = body.username?.trim();
    const requiredAmount =
      typeof body.requiredAmount === "number" && Number.isFinite(body.requiredAmount)
        ? body.requiredAmount
        : DEFAULT_REQUIRED_AMOUNT;

    if (!username) {
      return res.status(400).json({ success: false, message: "Invalid username" });
    }

    const y2MarketsUrl = (process.env.Y2_MARKETS_URL?.trim() || DEFAULT_Y2_MARKETS_URL).replace(/\/$/, "");
    const internalKey = readEnv("Y2_MARKETS_INTERNAL_KEY");

    const upstreamResponse = await fetch(`${y2MarketsUrl}/partner_verify_deposit.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Key": internalKey,
      },
      body: JSON.stringify({ username, requiredAmount }),
    });

    let payload: unknown;
    try {
      payload = await upstreamResponse.json();
    } catch {
      return res.status(502).json({
        success: false,
        message: "Invalid response from the Y2 Markets verification service.",
      });
    }

    if (payload && typeof payload === "object") {
      delete (payload as Record<string, unknown>).balance;
    }

    return res.status(upstreamResponse.ok ? 200 : upstreamResponse.status).json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return res.status(500).json({ success: false, message });
  }
}
