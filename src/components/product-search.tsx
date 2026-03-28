"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("q") ?? "";
  const currentCategory = searchParams.get("category") ?? "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = (formData.get("q") as string)?.trim();

    const params = new URLSearchParams();
    if (currentCategory) params.set("category", currentCategory);
    if (query) params.set("q", query);

    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        name="q"
        placeholder="Search products..."
        defaultValue={currentSearch}
        className="pl-9"
        aria-label="Search products"
      />
    </form>
  );
}
