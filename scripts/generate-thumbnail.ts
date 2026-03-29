/**
 * Generate a product thumbnail image using sharp.
 * Creates a gradient background with product title and category label.
 */

import sharp from "sharp";

const WIDTH = 800;
const HEIGHT = 600;

// Category-specific gradient colors
const CATEGORY_COLORS: Record<string, { from: string; to: string; accent: string }> = {
  templates: { from: "#6366f1", to: "#8b5cf6", accent: "#c4b5fd" },
  icons: { from: "#f43f5e", to: "#ec4899", accent: "#fda4af" },
  graphics: { from: "#f59e0b", to: "#ef4444", accent: "#fcd34d" },
  cheatsheets: { from: "#3b82f6", to: "#1d4ed8", accent: "#93c5fd" },
  wallpapers: { from: "#8b5cf6", to: "#d946ef", accent: "#d8b4fe" },
};

const CATEGORY_ICONS: Record<string, string> = {
  templates: "📄",
  icons: "🎨",
  graphics: "🖼️",
  cheatsheets: "📋",
  wallpapers: "🌄",
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length > maxCharsPerLine) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

export async function generateThumbnail(
  title: string,
  categorySlug: string
): Promise<Buffer> {
  const colors = CATEGORY_COLORS[categorySlug] ?? CATEGORY_COLORS.templates;
  const icon = CATEGORY_ICONS[categorySlug] ?? "📦";
  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  const titleLines = wrapText(title, 22);
  const titleY = 260 - (titleLines.length - 1) * 24;

  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="${WIDTH / 2}" dy="${i === 0 ? 0 : 48}">${escapeXml(line)}</tspan>`
    )
    .join("");

  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.from};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.to};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.3"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" rx="0"/>

      <!-- Decorative circles -->
      <circle cx="650" cy="100" r="180" fill="white" opacity="0.05"/>
      <circle cx="150" cy="500" r="120" fill="white" opacity="0.05"/>
      <circle cx="700" cy="450" r="80" fill="white" opacity="0.08"/>

      <!-- Category badge -->
      <rect x="${WIDTH / 2 - 70}" y="160" width="140" height="36" rx="18" fill="white" opacity="0.2"/>
      <text x="${WIDTH / 2}" y="184" font-family="Arial, sans-serif" font-size="16" font-weight="600" fill="white" text-anchor="middle">
        ${icon} ${escapeXml(categoryName)}
      </text>

      <!-- Title -->
      <text x="${WIDTH / 2}" y="${titleY}" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="white" text-anchor="middle" filter="url(#shadow)">
        ${titleTspans}
      </text>

      <!-- Bottom bar -->
      <rect x="0" y="${HEIGHT - 60}" width="${WIDTH}" height="60" fill="black" opacity="0.2"/>
      <text x="30" y="${HEIGHT - 26}" font-family="Arial, sans-serif" font-size="18" fill="${colors.accent}">
        ShopCraft
      </text>
      <text x="${WIDTH - 30}" y="${HEIGHT - 26}" font-family="Arial, sans-serif" font-size="16" fill="white" opacity="0.7" text-anchor="end">
        Digital Product
      </text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}
