-- Remove overly permissive UPDATE policy
-- Service role key bypasses RLS by default, so this policy is unnecessary
DROP POLICY IF EXISTS "Service role can update orders" ON public.orders;
