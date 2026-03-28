import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APP_URL } from "@/config/env";
import {
  POST_LOGIN_REDIRECT,
  LOGIN_PATH,
  CALLBACK_ERROR_CODES,
} from "@/config/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Check if OAuth provider returned an error (e.g., user denied consent)
  const oauthError = searchParams.get("error");
  if (oauthError) {
    return NextResponse.redirect(
      new URL(
        `${LOGIN_PATH}?error=${CALLBACK_ERROR_CODES.OAUTH_DENIED}`,
        APP_URL
      )
    );
  }

  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      new URL(
        `${LOGIN_PATH}?error=${CALLBACK_ERROR_CODES.MISSING_CODE}`,
        APP_URL
      )
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(
          `${LOGIN_PATH}?error=${CALLBACK_ERROR_CODES.CALLBACK_FAILED}`,
          APP_URL
        )
      );
    }
  } catch {
    return NextResponse.redirect(
      new URL(
        `${LOGIN_PATH}?error=${CALLBACK_ERROR_CODES.CALLBACK_FAILED}`,
        APP_URL
      )
    );
  }

  return NextResponse.redirect(new URL(POST_LOGIN_REDIRECT, APP_URL));
}
