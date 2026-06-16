import { supabase } from "@/lib/supabase/client";

export const PACKAGE_TYPE_BY_ID = {
  ai: "500_ai_signals",
  vvip: "1800_vvip",
  copy: "3500_copy_trading",
} as const;

export type DashboardPackageId = keyof typeof PACKAGE_TYPE_BY_ID;
export type PackageType = (typeof PACKAGE_TYPE_BY_ID)[DashboardPackageId];

export function toPackageType(packageId: string): PackageType | null {
  if (packageId in PACKAGE_TYPE_BY_ID) {
    return PACKAGE_TYPE_BY_ID[packageId as DashboardPackageId];
  }
  return null;
}

export async function findPendingPackageRequest(userId: string, packageType: PackageType) {
  return supabase
    .from("package_requests")
    .select("id")
    .eq("user_id", userId)
    .eq("package_type", packageType)
    .eq("status", "pending")
    .maybeSingle();
}

export async function getLatestPendingPackageRequest(userId: string) {
  return supabase
    .from("package_requests")
    .select("id, package_type, created_at")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function createPackageRequest(userId: string, packageType: PackageType) {
  return supabase.from("package_requests").insert({
    user_id: userId,
    package_type: packageType,
    status: "pending",
  });
}

export type PackageRequestResult =
  | { ok: true }
  | { ok: false; kind: "duplicate" | "error"; message: string };

export async function requestPackage(
  userId: string,
  packageId: string,
): Promise<PackageRequestResult> {
  const packageType = toPackageType(packageId);
  if (!packageType) {
    return { ok: false, kind: "error", message: "Invalid package selection." };
  }

  const { data: existing, error: lookupError } = await findPendingPackageRequest(
    userId,
    packageType,
  );

  if (lookupError) {
    return { ok: false, kind: "error", message: lookupError.message };
  }

  if (existing) {
    return {
      ok: false,
      kind: "duplicate",
      message: "You already have a pending request for this package.",
    };
  }

  const { error: insertError } = await createPackageRequest(userId, packageType);

  if (insertError) {
    return { ok: false, kind: "error", message: insertError.message };
  }

  return { ok: true };
}
