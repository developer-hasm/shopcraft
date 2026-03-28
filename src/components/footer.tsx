import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  FOOTER_PRODUCT_LINKS,
  FOOTER_COMPANY_LINKS,
  FOOTER_LEGAL_LINKS,
} from "@/config/site";
import type { NavLink } from "@/config/site";

interface FooterSectionProps {
  title: string;
  links: readonly NavLink[];
}

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <span className="text-lg font-bold">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{SITE_DESCRIPTION}</p>
          </div>

          <FooterSection title="Products" links={FOOTER_PRODUCT_LINKS} />
          <FooterSection title="Company" links={FOOTER_COMPANY_LINKS} />
          <FooterSection title="Legal" links={FOOTER_LEGAL_LINKS} />
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
