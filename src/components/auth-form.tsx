"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/icons/google-icon";
import { SITE_NAME } from "@/config/site";

interface AuthFormProps {
  variant: "login" | "signup";
}

export function AuthForm({ variant }: AuthFormProps) {
  const isLogin = variant === "login";

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
        <form
          className="space-y-4"
          aria-label={isLogin ? "Sign in" : "Create account"}
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Google OAuth */}
          <Button type="button" variant="outline" className="w-full gap-2">
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          {/* Name (signup only) */}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          <Button type="submit" className="w-full">
            {isLogin ? "Sign In" : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/login"
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
