import { Container } from "@/components/container";

const SKELETON_COUNT = 6;

export default function ProductsLoading() {
  return (
    <Container className="py-12">
      <div className="space-y-4">
        <div className="h-9 w-40 animate-pulse rounded bg-muted" />
        <div className="h-5 w-80 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-8 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-24 animate-pulse rounded bg-muted" />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-5 w-48 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-6 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
