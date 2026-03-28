import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free account to start buying and selling digital products.",
};

export default function SignUpPage() {
  return <AuthForm variant="signup" />;
}
