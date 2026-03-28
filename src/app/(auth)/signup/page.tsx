import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: `Sign Up | ${SITE_NAME}`,
  description: "Create a free account to start buying and selling digital products.",
};

export default function SignUpPage() {
  return <AuthForm variant="signup" />;
}
