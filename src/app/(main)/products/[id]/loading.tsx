import { Container } from "@/components/container";

export default function ProductDetailLoading() {
  return (
    <Container className="py-12">
      <div className="mb-8 h-5 w-32 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-xl bg-muted" />
        <div className="space-y-4">
          <div className="h-5 w-20 animate-pulse rounded bg-muted" />
          <div className="h-9 w-64 animate-pulse rounded bg-muted" />
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-px bg-border my-6" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
          <div className="pt-8 space-y-4">
            <div className="h-9 w-28 animate-pulse rounded bg-muted" />
            <div className="h-12 w-40 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </Container>
  );
}
