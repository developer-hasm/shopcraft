import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import type { Category } from "@/types/product";

interface CategoryFilterProps {
  categories: Category[];
  activeSlug?: string;
  currentSearch?: string;
}

function buildHref(slug?: string, search?: string): string {
  const params = new URLSearchParams();
  if (slug) params.set("category", slug);
  if (search) params.set("q", search);
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function CategoryFilter({
  categories,
  activeSlug,
  currentSearch,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      <Link
        href={buildHref(undefined, currentSearch)}
        className={buttonVariants({
          variant: !activeSlug ? "default" : "outline",
          size: "sm",
        })}
        aria-pressed={!activeSlug}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={buildHref(category.slug, currentSearch)}
          className={buttonVariants({
            variant: activeSlug === category.slug ? "default" : "outline",
            size: "sm",
          })}
          aria-pressed={activeSlug === category.slug}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
