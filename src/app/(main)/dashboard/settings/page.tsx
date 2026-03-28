import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import { LOGIN_PATH } from "@/config/auth";
import { ProfileForm } from "@/components/profile-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(LOGIN_PATH);

  const profile = await getProfile(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your profile</p>
      </div>

      <div className="max-w-xl space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <ProfileForm
          nickname={profile?.nickname ?? ""}
          bio={profile?.bio ?? ""}
        />
      </div>
    </div>
  );
}
