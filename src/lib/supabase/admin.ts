import { supabase } from "@/lib/supabase/client";

export type VerificationStatusLabel = "Pending" | "Verified" | "Rejected";

type VerificationRow = {
  id: string;
  user_id: string;
  pocket_trader_id: string;
  verification_status: string;
  verified_under: string | null;
  created_at: string;
};

type RedirectRow = {
  id: string;
  user_id: string;
  selected_referrer: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
};

export type AdminMetrics = {
  totalLeads: number;
  existingMembers: number;
  newRegistrations: number;
  pendingVerifications: number;
  verifiedMembers: number;
};

export type ExistingMemberRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  pocketTraderId: string;
  verificationStatus: VerificationStatusLabel;
  verifiedUnder: string | null;
  createdAt: string;
};

export type NewRegistrationRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  redirectedTo: string;
  createdAt: string;
};

export type AdminDashboardData = {
  metrics: AdminMetrics;
  existingMembers: ExistingMemberRow[];
  newRegistrations: NewRegistrationRow[];
};

function formatVerificationStatus(status: string): VerificationStatusLabel {
  switch (status) {
    case "verified":
      return "Verified";
    case "rejected":
      return "Rejected";
    default:
      return "Pending";
  }
}

function latestByUserId<T extends { user_id: string; created_at: string }>(rows: T[]): Map<string, T> {
  const map = new Map<string, T>();
  for (const row of rows) {
    const existing = map.get(row.user_id);
    if (!existing || row.created_at > existing.created_at) {
      map.set(row.user_id, row);
    }
  }
  return map;
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const [profilesRes, verificationsRes, redirectsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, phone, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("verification_requests")
      .select("id, user_id, pocket_trader_id, verification_status, verified_under, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("referral_redirects")
      .select("id, user_id, selected_referrer, created_at")
      .order("created_at", { ascending: false }),
  ]);

  if (profilesRes.error) throw profilesRes.error;
  if (verificationsRes.error) throw verificationsRes.error;
  if (redirectsRes.error) throw redirectsRes.error;

  const profiles = (profilesRes.data ?? []) as ProfileRow[];
  const verifications = (verificationsRes.data ?? []) as VerificationRow[];
  const redirects = (redirectsRes.data ?? []) as RedirectRow[];

  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const latestVerificationByUser = latestByUserId(verifications);
  const latestRedirectByUser = latestByUserId(redirects);

  const verifiedUserIds = new Set<string>();
  for (const [userId, verification] of latestVerificationByUser) {
    if (verification.verification_status === "verified") {
      verifiedUserIds.add(userId);
    }
  }

  const existingMembers: ExistingMemberRow[] = [];
  for (const [userId, verification] of latestVerificationByUser) {
    const profile = profileById.get(userId);
    if (!profile) continue;

    existingMembers.push({
      id: verification.id,
      name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      pocketTraderId: verification.pocket_trader_id,
      verificationStatus: formatVerificationStatus(verification.verification_status),
      verifiedUnder: verification.verified_under,
      createdAt: verification.created_at,
    });
  }

  existingMembers.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const newRegistrations: NewRegistrationRow[] = [];
  for (const [userId, redirect] of latestRedirectByUser) {
    const profile = profileById.get(userId);
    if (!profile) continue;

    newRegistrations.push({
      id: redirect.id,
      name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      redirectedTo: redirect.selected_referrer,
      createdAt: redirect.created_at,
    });
  }

  newRegistrations.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return {
    metrics: {
      totalLeads: profiles.length,
      existingMembers: latestVerificationByUser.size,
      newRegistrations: latestRedirectByUser.size,
      pendingVerifications: verifications.filter(
        (verification) => verification.verification_status === "pending",
      ).length,
      verifiedMembers: verifiedUserIds.size,
    },
    existingMembers,
    newRegistrations,
  };
}
