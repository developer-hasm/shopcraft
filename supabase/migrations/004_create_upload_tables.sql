-- ============================================
-- ShopCraft: Upload Tables Migration
-- ============================================

-- 1. Product Images (public thumbnails/previews)
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX product_images_product_id_idx ON public.product_images (product_id, sort_order);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product images are viewable by everyone"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Sellers can insert product images"
  ON public.product_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can delete own product images"
  ON public.product_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );

-- 2. Product Files (private digital goods)
CREATE TABLE public.product_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL CHECK (file_size <= 52428800),
  mime_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX product_files_product_id_idx ON public.product_files (product_id);

ALTER TABLE public.product_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view own product files"
  ON public.product_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can insert product files"
  ON public.product_files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can delete own product files"
  ON public.product_files FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );

-- 3. Downloads (purchase download records)
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  ip_address VARCHAR(45),
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX downloads_order_id_idx ON public.downloads (order_id);
CREATE INDEX downloads_user_id_idx ON public.downloads (user_id);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own downloads"
  ON public.downloads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own downloads"
  ON public.downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Storage bucket policies (run after creating buckets in Dashboard)
-- product-images bucket: authenticated users can upload
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('product-files', 'product-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS for product-images (public read, auth upload)
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage RLS for product-files (auth upload, signed URL download)
CREATE POLICY "Authenticated users can upload product files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own product files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-files' AND auth.uid()::text = (storage.foldername(name))[1]);
