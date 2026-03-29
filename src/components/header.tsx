"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, Search, User, LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { SITE_NAME, NAV_LINKS } from "@/config/site";
import { LOGIN_PATH, DASHBOARD_PATH } from "@/config/auth";
import { logout } from "@/app/actions/auth";

export interface HeaderUser {
  email: string;
  displayName: string;
}

function getUserInitial(user: HeaderUser): string {
  const name = user.displayName || user.email || "?";
  return name.charAt(0).toUpperCase();
}

function UserMenu({ user }: { user: HeaderUser }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="User menu"
        aria-expanded={open}
      >
        {getUserInitial(user)}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-56 rounded-lg border bg-popover p-1 shadow-md">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">
              {user.displayName || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <div className="h-px bg-border my-1" />
          <Link
            href={DASHBOARD_PATH}
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <div className="h-px bg-border my-1" />
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export function Header({ user }: { user: HeaderUser | null }) {
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
            <UserMenu user={user} />
          ) : (
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
