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
