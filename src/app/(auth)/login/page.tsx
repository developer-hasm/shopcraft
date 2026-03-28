import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Sign In | ${SITE_NAME}`,
  description: `Sign in to your ${SITE_NAME} account to buy and sell digital products.`,
};

export default function LoginPage() {
  return <AuthForm variant="login" />;
}
