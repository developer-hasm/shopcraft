"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { APP_URL } from "@/config/env";
import {
  POST_LOGIN_REDIRECT,
  LOGIN_PATH,
  CALLBACK_PATH,
  ROOT_LAYOUT_PATH,
  MIN_PASSWORD_LENGTH,
  USER_METADATA_DISPLAY_NAME,
  AUTH_ERRORS,
  CALLBACK_ERROR_CODES,
} from "@/config/auth";

export interface AuthActionState {
  error?: string;
}

function validateString(
  value: FormDataEntryValue | null,
  fieldName: string
): string | AuthActionState {
  if (typeof value !== "string" || !value.trim()) {
    return { error: `${fieldName} is required.` };
  }
  return value.trim();
}

export async function login(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const email = validateString(formData.get("email"), "Email");
  if (typeof email !== "string") return email;

  const password = validateString(formData.get("password"), "Password");
  if (typeof password !== "string") return password;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: AUTH_ERRORS.INVALID_CREDENTIALS };
  }

  revalidatePath(ROOT_LAYOUT_PATH, "layout");
  redirect(POST_LOGIN_REDIRECT);
}

export async function signup(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const name = validateString(formData.get("name"), "Name");
  if (typeof name !== "string") return name;

  const email = validateString(formData.get("email"), "Email");
  if (typeof email !== "string") return email;

  const password = validateString(formData.get("password"), "Password");
  if (typeof password !== "string") return password;

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { [USER_METADATA_DISPLAY_NAME]: name },
    },
  });

  if (error) {
    return { error: AUTH_ERRORS.SIGNUP_FAILED };
  }

  // Handle duplicate email: Supabase returns empty identities for existing users
  if (data.user && data.user.identities?.length === 0) {
    return { error: AUTH_ERRORS.SIGNUP_FAILED };
  }

  revalidatePath(ROOT_LAYOUT_PATH, "layout");
  redirect(POST_LOGIN_REDIRECT);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath(ROOT_LAYOUT_PATH, "layout");
  redirect(LOGIN_PATH);
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${APP_URL}${CALLBACK_PATH}`,
    },
  });

  if (error || !data.url) {
    redirect(`${LOGIN_PATH}?error=${CALLBACK_ERROR_CODES.OAUTH_DENIED}`);
  }

  redirect(data.url);
}
