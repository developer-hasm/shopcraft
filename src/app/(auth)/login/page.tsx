import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { SITE_NAME } from "@/config/site";
import { AUTH_ERRORS, CALLBACK_ERROR_CODES } from "@/config/auth";

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign in to your ${SITE_NAME} account to buy and sell digital products.`,
};

const ERROR_MESSAGES: Record<string, string> = {
  [CALLBACK_ERROR_CODES.OAUTH_DENIED]: AUTH_ERRORS.OAUTH_FAILED,
  [CALLBACK_ERROR_CODES.MISSING_CODE]: AUTH_ERRORS.OAUTH_FAILED,
  [CALLBACK_ERROR_CODES.CALLBACK_FAILED]: AUTH_ERRORS.OAUTH_FAILED,
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const errorCode = typeof params.error === "string" ? params.error : undefined;
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] : undefined;

  return <AuthForm variant="login" errorMessage={errorMessage} />;
}
