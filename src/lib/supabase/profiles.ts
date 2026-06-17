import { supabase } from "@/lib/supabase/client";

export type ProfileInsert = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
};

export async function insertProfile(profile: ProfileInsert) {
  return supabase.from("profiles").insert(profile);
}

export type Profile = {
  full_name: string;
  email: string;
  phone: string;
};

export async function fetchProfile(userId: string) {
  return supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", userId)
    .maybeSingle();
}
