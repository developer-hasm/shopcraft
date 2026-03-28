"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ROOT_LAYOUT_PATH } from "@/config/auth";

export interface ProfileActionState {
  error?: string;
  success?: boolean;
}

export async function updateProfile(
  _prevState: ProfileActionState | null,
  formData: FormData
): Promise<ProfileActionState> {
  const nickname = formData.get("nickname");
  if (typeof nickname !== "string" || !nickname.trim()) {
    return { error: "Nickname is required." };
  }

  const bio = (formData.get("bio") as string)?.trim() || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any)
    .update({ nickname: nickname.trim(), bio })
    .eq("id", user.id);

  if (error) {
    console.error("Update profile error:", error);
    return { error: "Failed to update profile. Please try again." };
  }

  revalidatePath(ROOT_LAYOUT_PATH, "layout");
  return { success: true };
}
