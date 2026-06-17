export const ADMIN_EMAILS = [
  "Nebzmannuel@gmail.com",
  "WealthHubFX01@gmail.com",
  "autocraticemsquare@gmail.com",
] as const;

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized);
}
