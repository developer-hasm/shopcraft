import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { getFeaturedProducts } from "@/lib/queries/products";
import { createClient } from "@/lib/supabase/server";
import { SITE_NAME } from "@/config/site";
import { SIGNUP_PATH } from "@/config/auth";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: "Curated Quality",
    description: "Every product is reviewed for quality before listing.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe transactions powered by Stripe.",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Download your purchase immediately after payment.",
  },
];

const NEW_PRODUCT_PATH = "/dashboard/products/new";

export default async function Home() {
  const [featuredProducts, supabase] = await Promise.all([
    getFeaturedProducts(),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sellPath = user ? NEW_PRODUCT_PATH : SIGNUP_PATH;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50" aria-labelledby="hero-heading">
        <Container className="py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Digital Marketplace
            </Badge>
            <h1 id="hero-heading" className="text-4xl font-bold tracking-tight sm:text-6xl">
              Discover & Sell
              <br />
              <span className="text-muted-foreground">Digital Products</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Templates, icons, fonts, and more. Find the perfect digital assets
              for your next project, or start selling your own creations.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className={buttonVariants({ size: "lg", className: "gap-2" })}
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={sellPath}
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Start Selling
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-20" aria-labelledby="featured-heading">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <h2 id="featured-heading" className="text-2xl font-bold tracking-tight">
                Featured Products
              </h2>
              <p className="mt-1 text-muted-foreground">
                Hand-picked digital assets for you
              </p>
            </div>
            <Link
              href="/products"
              className={buttonVariants({ variant: "ghost", className: "gap-1" })}
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30" aria-labelledby="features-heading">
        <Container className="py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="features-heading" className="text-2xl font-bold tracking-tight">
              Why {SITE_NAME}?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to buy and sell digital products
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20" aria-labelledby="cta-heading">
        <Container>
          <div className="rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground">
            <h2 id="cta-heading" className="text-3xl font-bold">Ready to start selling?</h2>
            <p className="mt-4 text-primary-foreground/80">
              Join thousands of creators and start earning from your digital
              products today.
            </p>
            <Link
              href={sellPath}
              className={buttonVariants({ size: "lg", variant: "secondary", className: "mt-8 gap-2" })}
            >
              Create Your Store
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
