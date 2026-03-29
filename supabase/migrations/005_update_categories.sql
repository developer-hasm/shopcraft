-- ============================================
-- ShopCraft: Update Categories
-- Remove Fonts, add Cheatsheets, Wallpapers
-- ============================================

-- Remove Fonts category (and its products)
DELETE FROM public.products WHERE category_id IN (
  SELECT id FROM public.categories WHERE slug = 'fonts'
);
DELETE FROM public.categories WHERE slug = 'fonts';

-- Add new categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('UI Components', 'ui-components', 3),
  ('Wallpapers', 'wallpapers', 4)
ON CONFLICT (slug) DO NOTHING;

-- Update sort_order for consistency
UPDATE public.categories SET sort_order = 0 WHERE slug = 'templates';
UPDATE public.categories SET sort_order = 1 WHERE slug = 'icons';
UPDATE public.categories SET sort_order = 2 WHERE slug = 'graphics';
UPDATE public.categories SET sort_order = 3 WHERE slug = 'ui-components';
UPDATE public.categories SET sort_order = 4 WHERE slug = 'wallpapers';
