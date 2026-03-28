import { createClient } from "@/lib/supabase/server";

export interface Profile {
  nickname: string;
  bio: string | null;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("nickname, bio")
    .eq("id", userId)
    .single<Profile>();

  if (error || !data) return null;

  return data;
}
