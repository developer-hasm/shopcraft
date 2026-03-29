/**
 * Seed products with auto-generated files and thumbnails.
 * Generates one product per category, uploads thumbnail + product file to Supabase Storage.
 *
 * Run: npx tsx scripts/seed-product.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import archiver from "archiver";
import {
  generateTemplateThumbnail,
  generateIconThumbnail,
  generateGraphicThumbnail,
  generateUIComponentThumbnail,
  generateWallpaperThumbnail,
} from "./generate-thumbnail";
import {
  generateTemplate,
  generateIconSet,
  generateGraphic,
  generateUIComponent,
  generateWallpaper,
} from "./generate-product";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface ProductDef {
  title: string;
  description: string;
  price: number;
  categorySlug: string;
  fileExt: string;
  generateFile: (title: string) => Buffer | Promise<Buffer>;
}

const PRODUCT_POOL: ProductDef[] = [
  // Templates
  {
    title: "E-commerce Dashboard Template",
    description: "A complete e-commerce admin dashboard with analytics, order management, and inventory tracking. Built with modern HTML and CSS.",
    price: 2000, categorySlug: "templates", fileExt: "html",
    generateFile: generateTemplate,
  },
  {
    title: "Blog Starter Kit",
    description: "A minimal blog template with dark mode and SEO optimization. Perfect for developers and writers.",
    price: 1000, categorySlug: "templates", fileExt: "html",
    generateFile: generateTemplate,
  },
  {
    title: "SaaS Landing Page Template",
    description: "High-converting landing page template with pricing tables, testimonials, and CTA sections.",
    price: 1500, categorySlug: "templates", fileExt: "html",
    generateFile: generateTemplate,
  },
  {
    title: "Portfolio Website Template",
    description: "A sleek portfolio template for designers and developers. Includes project gallery and contact form.",
    price: 1000, categorySlug: "templates", fileExt: "html",
    generateFile: generateTemplate,
  },
  // Icons
  {
    title: "Outline Icon Pack - 200 Icons",
    description: "A comprehensive set of outline-style SVG icons for web and mobile apps.",
    price: 2000, categorySlug: "icons", fileExt: "svg",
    generateFile: generateIconSet,
  },
  {
    title: "Animated Icon Set",
    description: "Beautifully crafted SVG icons in multiple styles. Perfect for UI design.",
    price: 1500, categorySlug: "icons", fileExt: "svg",
    generateFile: generateIconSet,
  },
  {
    title: "Social Media Icon Pack",
    description: "Complete set of social media brand icons in SVG format. 40+ platforms covered.",
    price: 3000, categorySlug: "icons", fileExt: "svg",
    generateFile: generateIconSet,
  },
  // Graphics
  {
    title: "Abstract Background Collection",
    description: "30 high-resolution abstract SVG backgrounds in vibrant colors for presentations and websites.",
    price: 5000, categorySlug: "graphics", fileExt: "svg",
    generateFile: generateGraphic,
  },
  {
    title: "UI Illustration Pack",
    description: "Custom SVG illustrations for web interfaces. Covers onboarding, empty states, and errors.",
    price: 5000, categorySlug: "graphics", fileExt: "svg",
    generateFile: generateGraphic,
  },
  {
    title: "Geometric Pattern Collection",
    description: "Seamless geometric SVG patterns including various styles and color schemes.",
    price: 3000, categorySlug: "graphics", fileExt: "svg",
    generateFile: generateGraphic,
  },
  // UI Components
  {
    title: "Button Component Pack",
    description: "Collection of 15+ button styles: primary, secondary, danger, outline, ghost, pill, and icon buttons in multiple sizes. Copy-paste ready HTML/CSS.",
    price: 2000, categorySlug: "ui-components", fileExt: "html",
    generateFile: generateUIComponent,
  },
  {
    title: "Card Component Collection",
    description: "Beautiful card components for products, blog posts, and profiles. Includes hover effects, badges, and responsive grid layouts.",
    price: 3000, categorySlug: "ui-components", fileExt: "html",
    generateFile: generateUIComponent,
  },
  {
    title: "Form Component Kit",
    description: "Complete form components with inputs, textareas, selects, and validation styles. Includes contact form, login form, and signup form layouts.",
    price: 3500, categorySlug: "ui-components", fileExt: "html",
    generateFile: generateUIComponent,
  },
  // Wallpapers
  {
    title: "Dark Abstract Wallpaper Pack",
    description: "Set of dark-themed abstract wallpapers in 1920x1080 resolution. Generated with unique patterns.",
    price: 3000, categorySlug: "wallpapers", fileExt: "png",
    generateFile: generateWallpaper,
  },
  {
    title: "Gradient Mesh Wallpapers",
    description: "Beautiful gradient mesh wallpapers in high resolution. Perfect for desktop backgrounds.",
    price: 4000, categorySlug: "wallpapers", fileExt: "png",
    generateFile: generateWallpaper,
  },
  {
    title: "Neon Glow Wallpaper Collection",
    description: "Vibrant neon-themed wallpapers with glowing effects. 1920x1080 PNG format.",
    price: 5000, categorySlug: "wallpapers", fileExt: "png",
    generateFile: generateWallpaper,
  },
];

function createZipBuffer(fileName: string, fileContent: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("data", (chunk: Buffer) => chunks.push(chunk));
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", reject);

    archive.append(fileContent, { name: fileName });
    archive.finalize();
  });
}

const CATEGORY_SLUGS = ["templates", "icons", "graphics", "ui-components", "wallpapers"];

async function seedProducts() {
  // Get first seller
  const { data: seller } = await supabase
    .from("profiles")
    .select("id")
    .limit(1)
    .single();

  if (!seller) {
    console.error("No seller found in profiles");
    process.exit(1);
  }

  const sellerId = seller.id;

  for (const slug of CATEGORY_SLUGS) {
    // Get category ID
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!category) {
      console.error(`Category "${slug}" not found, skipping`);
      continue;
    }

    // Pick a random product from this category
    const candidates = PRODUCT_POOL.filter((p) => p.categorySlug === slug);
    const def = candidates[Math.floor(Math.random() * candidates.length)];

    // Check if already exists
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("title", def.title)
      .limit(1);

    if (existing && existing.length > 0) {
      const other = candidates.find((c) => c.title !== def.title);
      if (!other) {
        console.log(`⏭️  [${slug}] All products exist, skipping`);
        continue;
      }
      Object.assign(def, other);
    }

    console.log(`🔧 [${slug}] Generating "${def.title}"...`);

    // 1. Generate product file
    const fileContent = await def.generateFile(def.title);

    // 2. Create ZIP
    const zipBuffer = await createZipBuffer(
      `${def.title.toLowerCase().replace(/\s+/g, "-")}.${def.fileExt}`,
      fileContent
    );

    // 3. Generate thumbnail based on category
    let thumbnailBuffer: Buffer;
    switch (slug) {
      case "templates":
        thumbnailBuffer = await generateTemplateThumbnail(fileContent);
        break;
      case "icons":
        thumbnailBuffer = await generateIconThumbnail(def.title);
        break;
      case "graphics":
        thumbnailBuffer = await generateGraphicThumbnail(fileContent);
        break;
      case "ui-components":
        thumbnailBuffer = await generateUIComponentThumbnail(fileContent);
        break;
      case "wallpapers":
        thumbnailBuffer = await generateWallpaperThumbnail(fileContent);
        break;
      default:
        thumbnailBuffer = await generateIconThumbnail(def.title);
    }

    // 4. Upload thumbnail to product-images bucket
    const thumbPath = `${sellerId}/${crypto.randomUUID()}.png`;
    const { error: thumbError } = await supabase.storage
      .from("product-images")
      .upload(thumbPath, thumbnailBuffer, { contentType: "image/png" });

    if (thumbError) {
      console.error(`  ❌ Thumbnail upload failed:`, thumbError.message);
      continue;
    }

    const { data: thumbUrl } = supabase.storage
      .from("product-images")
      .getPublicUrl(thumbPath);

    // 5. Upload product file to product-files bucket
    const filePath = `${sellerId}/${crypto.randomUUID()}.zip`;
    const { error: fileError } = await supabase.storage
      .from("product-files")
      .upload(filePath, zipBuffer, { contentType: "application/zip" });

    if (fileError) {
      console.error(`  ❌ File upload failed:`, fileError.message);
      continue;
    }

    // 6. Create product in DB
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        title: def.title,
        description: def.description,
        price: def.price,
        category_id: category.id,
        seller_id: sellerId,
        status: "active",
        is_featured: Math.random() > 0.6,
        image_url: thumbUrl.publicUrl,
        file_url: filePath,
      })
      .select("id")
      .single();

    if (productError || !product) {
      console.error(`  ❌ DB insert failed:`, productError?.message);
      continue;
    }

    // 7. Create product_images record
    await supabase.from("product_images").insert({
      product_id: product.id,
      url: thumbUrl.publicUrl,
      sort_order: 0,
    });

    // 8. Create product_files record
    await supabase.from("product_files").insert({
      product_id: product.id,
      file_name: `${def.title.toLowerCase().replace(/\s+/g, "-")}.zip`,
      file_path: filePath,
      file_size: zipBuffer.length,
      mime_type: "application/zip",
    });

    console.log(`  ✅ Created: "${def.title}" (thumbnail + ${(zipBuffer.length / 1024).toFixed(1)}KB ZIP)`);
  }

  console.log("\n🎉 Done!");
}

seedProducts();
