import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function readEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY"): string | undefined {
  const value = import.meta.env[name];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getSupabaseConfig() {
  return {
    url: readEnv("VITE_SUPABASE_URL"),
    anonKey: readEnv("VITE_SUPABASE_ANON_KEY"),
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

function warnMissingConfig() {
  if (!import.meta.env.DEV || isSupabaseConfigured()) return;

  console.warn(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and add your project credentials.",
  );
}

function createSupabaseClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    warnMissingConfig();
    return createClient("http://127.0.0.1:54321", "public-anon-key-not-configured", {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export const supabase = createSupabaseClient();
