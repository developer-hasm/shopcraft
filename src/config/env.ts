function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
export const APP_URL = requireEnv("NEXT_PUBLIC_APP_URL");

// Stripe (server-only — no NEXT_PUBLIC_ prefix)
export const STRIPE_SECRET_KEY = requireEnv("STRIPE_SECRET_KEY");
export const STRIPE_WEBHOOK_SECRET = requireEnv("STRIPE_WEBHOOK_SECRET");
