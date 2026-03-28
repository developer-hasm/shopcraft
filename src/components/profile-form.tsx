"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateProfile,
  type ProfileActionState,
} from "@/app/actions/profile";

interface ProfileFormProps {
  nickname: string;
  bio: string;
}

export function ProfileForm({ nickname, bio }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState<
    ProfileActionState | null,
    FormData
  >(updateProfile, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </div>
      )}
      {state?.success && (
        <div
          role="status"
          className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-800"
        >
          Profile updated successfully.
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          name="nickname"
          required
          defaultValue={nickname}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={bio}
          placeholder="Tell us about yourself..."
          disabled={isPending}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
