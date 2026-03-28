-- ============================================
-- ShopCraft: Seed Data
-- ============================================
-- IMPORTANT: Run 001_create_core_tables.sql first
-- Then sign up a test user at http://localhost:3000/signup
-- Replace the seller_id below with your user's UUID from auth.users

-- 1. Categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Templates', 'templates', 0),
  ('Icons', 'icons', 1),
  ('Fonts', 'fonts', 2),
  ('Graphics', 'graphics', 3);

-- 2. Products
-- Replace 'YOUR_USER_UUID_HERE' with your actual user ID from Supabase Dashboard > Authentication > Users
DO $$
DECLARE
  seller UUID := 'YOUR_USER_UUID_HERE';
  cat_templates UUID;
  cat_icons UUID;
  cat_fonts UUID;
  cat_graphics UUID;
BEGIN
  SELECT id INTO cat_templates FROM public.categories WHERE slug = 'templates';
  SELECT id INTO cat_icons FROM public.categories WHERE slug = 'icons';
  SELECT id INTO cat_fonts FROM public.categories WHERE slug = 'fonts';
  SELECT id INTO cat_graphics FROM public.categories WHERE slug = 'graphics';

  INSERT INTO public.products (title, description, price, category_id, seller_id, status, is_featured) VALUES
    (
      'Minimal Dashboard UI Kit',
      'A clean and modern dashboard template built with React and Tailwind CSS. Includes 20+ pre-built components, dark mode support, and responsive layouts.',
      12000, cat_templates, seller, 'active', true
    ),
    (
      '3D Icon Pack - 100 Icons',
      'A collection of 100 beautiful 3D icons in SVG and PNG formats. Perfect for web and mobile apps. Includes source files.',
      8000, cat_icons, seller, 'active', true
    ),
    (
      'Modern Sans-Serif Font',
      'A versatile geometric sans-serif typeface with 8 weights. Ideal for headings, body text, and UI elements. OTF and WOFF2 formats included.',
      5000, cat_fonts, seller, 'active', true
    ),
    (
      'Notion Template Bundle',
      'A comprehensive bundle of 10 Notion templates for productivity, project management, and personal organization.',
      3000, cat_templates, seller, 'active', true
    ),
    (
      'Landing Page Kit',
      'A collection of 5 ready-to-use landing page templates. Built with Next.js and Tailwind CSS. Fully responsive and customizable.',
      15000, cat_templates, seller, 'active', false
    ),
    (
      'Hand-drawn Icon Set',
      'A unique set of 60 hand-drawn icons in a playful style. Available in SVG, PNG, and Figma formats.',
      6000, cat_icons, seller, 'active', false
    ),
    (
      'Gradient Background Pack',
      'A collection of 50 beautiful gradient backgrounds in high resolution. Perfect for presentations, social media, and web design.',
      4000, cat_graphics, seller, 'active', false
    ),
    (
      'Geometric Pattern Collection',
      'A set of 30 seamless geometric patterns in vector format. Includes both light and dark variations.',
      7000, cat_graphics, seller, 'active', false
    );
END $$;
