"use client";

import { useActionState, useTransition } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/icons/google-icon";
import { SITE_NAME } from "@/config/site";
import {
  LOGIN_PATH,
  SIGNUP_PATH,
  MIN_PASSWORD_LENGTH,
} from "@/config/auth";
import {
  login,
  signup,
  signInWithGoogle,
  type AuthActionState,
} from "@/app/actions/auth";

interface AuthFormProps {
  variant: "login" | "signup";
  errorMessage?: string;
}

export function AuthForm({ variant, errorMessage }: AuthFormProps) {
  const isLogin = variant === "login";
  const [state, formAction, isPending] = useActionState<
    AuthActionState | null,
    FormData
  >(isLogin ? login : signup, null);
  const [isGooglePending, startGoogleTransition] = useTransition();

  const displayError = state?.error || errorMessage;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <ShoppingBag className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">
          {isLogin ? "Welcome back" : "Create an account"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isLogin
            ? `Sign in to your ${SITE_NAME} account`
            : "Start buying and selling digital products"}
        </p>
      </CardHeader>
      <CardContent>
        {/* Error display */}
        {displayError && (
          <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {displayError}
          </div>
        )}

        {/* Google OAuth */}
        <form
          action={() => startGoogleTransition(() => signInWithGoogle())}
          className="mb-4"
        >
          <Button
            type="submit"
            variant="outline"
            className="w-full gap-2"
            disabled={isGooglePending || isPending}
          >
            <GoogleIcon />
            {isGooglePending ? "Redirecting..." : "Continue with Google"}
          </Button>
        </form>

        <div className="relative mb-4">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        {/* Email/Password Form */}
        <form
          action={formAction}
          className="space-y-4"
          aria-label={isLogin ? "Sign in" : "Create account"}
        >
          {/* Name (signup only) */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                disabled={isPending}
                autoComplete="name"
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isPending}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending || isGooglePending}>
            {isPending
              ? "Loading..."
              : isLogin
                ? "Sign In"
                : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href={SIGNUP_PATH}
                  className="font-medium text-primary hover:underline"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href={LOGIN_PATH}
                  className="font-medium text-primary hover:underline"
                >
                  Sign In
                </Link>
              </>
            )}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
