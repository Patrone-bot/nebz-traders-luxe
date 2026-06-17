const ALLOWED_REDIRECT_PATHS = new Set([
  "/dashboard",
  "/verify",
  "/verify-existing",
  "/verify-new",
  "/admin",
]);

export function getPostLoginRedirect(path?: string): string {
  if (path && ALLOWED_REDIRECT_PATHS.has(path)) {
    return path;
  }
  return "/dashboard";
}
