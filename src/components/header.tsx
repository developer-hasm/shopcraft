"use client";

import Link from "next/link";
import { ShoppingBag, Menu, Search, User, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { buttonVariants } from "@/components/ui/button-variants";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { SITE_NAME, NAV_LINKS } from "@/config/site";
import { LOGIN_PATH, DASHBOARD_PATH, USER_METADATA_DISPLAY_NAME } from "@/config/auth";
import { logout } from "@/app/actions/auth";

interface HeaderProps {
  user: SupabaseUser | null;
}

function getUserInitial(user: SupabaseUser): string {
  const name = user.user_metadata?.[USER_METADATA_DISPLAY_NAME] || user.email || "?";
  return name.charAt(0).toUpperCase();
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight">{SITE_NAME}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={buttonVariants({ variant: "ghost", size: "icon", className: "hidden sm:flex" })}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {user ? (
            /* Logged in: Avatar dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getUserInitial(user)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">
                    {user.user_metadata?.[USER_METADATA_DISPLAY_NAME] || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={DASHBOARD_PATH} className="w-full">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={logout}>
                  <DropdownMenuItem>
                    <button type="submit" className="flex w-full items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Not logged in: Sign in link */
            <Link
              href={LOGIN_PATH}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
              aria-label="Sign in"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger
              className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Menu</SheetTitle>
              <nav className="mt-6 flex flex-col gap-4" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <form action={logout}>
                    <Button type="submit" variant="outline" className="mt-4 w-full gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </form>
                ) : (
                  <Link
                    href={LOGIN_PATH}
                    className={buttonVariants({ className: "mt-4 w-full" })}
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
