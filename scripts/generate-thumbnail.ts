/**
 * Generate product thumbnails that show actual content previews.
 * Each category uses a different rendering strategy.
 */

import sharp from "sharp";
import puppeteer from "puppeteer";

const WIDTH = 800;
const HEIGHT = 600;

// ==========================================
// Templates: Screenshot the generated HTML
// ==========================================
export async function generateTemplateThumbnail(
  htmlContent: Buffer
): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setContent(htmlContent.toString("utf-8"), {
    waitUntil: "networkidle0",
  });
  const screenshot = await page.screenshot({ type: "png" });
  await browser.close();

  return sharp(screenshot).resize(WIDTH, HEIGHT, { fit: "cover" }).png().toBuffer();
}

// ==========================================
// Icons: Render SVG icons in a grid
// ==========================================
const ICON_PATHS = [
  "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1",
  "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
  "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  "M13 10V3L4 14h7v7l9-11h-7z",
  "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
];

export async function generateIconThumbnail(title: string): Promise<Buffer> {
  const colors = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const cols = 4;
  const rows = 3;
  const cellSize = 160;
  const iconSize = 48;
  const padding = 40;
  const svgW = cols * cellSize + padding * 2;
  const svgH = rows * cellSize + padding * 2 + 80;

  let icons = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (idx >= ICON_PATHS.length) break;
      const x = padding + c * cellSize + (cellSize - iconSize) / 2;
      const y = padding + 60 + r * cellSize + (cellSize - iconSize) / 2;
      icons += `
        <rect x="${padding + c * cellSize + 10}" y="${padding + 60 + r * cellSize + 10}" width="${cellSize - 20}" height="${cellSize - 20}" rx="16" fill="white" opacity="0.06"/>
        <g transform="translate(${x}, ${y}) scale(${iconSize / 24})">
          <path d="${ICON_PATHS[idx]}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>`;
    }
  }

  const svg = `<svg width="${svgW}" height="${svgH}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${svgW}" height="${svgH}" fill="#0f172a"/>
    <text x="${svgW / 2}" y="45" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">${escapeXml(title)}</text>
    ${icons}
    <text x="${svgW / 2}" y="${svgH - 20}" font-family="Arial" font-size="13" fill="white" opacity="0.3" text-anchor="middle">${ICON_PATHS.length} icons included</text>
  </svg>`;

  return sharp(Buffer.from(svg)).resize(WIDTH, HEIGHT, { fit: "cover" }).png().toBuffer();
}

// ==========================================
// Graphics: Render the actual SVG as thumbnail
// ==========================================
export async function generateGraphicThumbnail(
  svgContent: Buffer
): Promise<Buffer> {
  return sharp(svgContent).resize(WIDTH, HEIGHT, { fit: "cover" }).png().toBuffer();
}

// ==========================================
// Cheatsheets: Render markdown as code-style image
// ==========================================
export async function generateCheatsheetThumbnail(
  title: string,
  mdContent: Buffer
): Promise<Buffer> {
  const lines = mdContent.toString("utf-8").split("\n").slice(0, 25);
  const lineHeight = 18;
  const padding = 30;
  const svgH = lines.length * lineHeight + padding * 2 + 60;
  const svgW = 900;

  const textLines = lines.map((line, i) => {
    const y = padding + 55 + i * lineHeight;
    const escaped = escapeXml(line);
    const isHeading = line.startsWith("#");
    const isTable = line.startsWith("|");
    const isCode = line.startsWith("```");
    const color = isHeading ? "#93c5fd" : isTable ? "#86efac" : isCode ? "#fda4af" : "#e2e8f0";
    const weight = isHeading ? "bold" : "normal";
    const size = isHeading ? "16" : "13";
    return `<text x="${padding + 10}" y="${y}" font-family="Consolas, monospace" font-size="${size}" font-weight="${weight}" fill="${color}">${escaped}</text>`;
  }).join("\n");

  const svg = `<svg width="${svgW}" height="${svgH}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${svgW}" height="${svgH}" fill="#1e1e2e" rx="12"/>
    <rect x="0" y="0" width="${svgW}" height="40" fill="#181825" rx="12"/>
    <rect x="0" y="12" width="${svgW}" height="28" fill="#181825"/>
    <circle cx="20" cy="20" r="6" fill="#f38ba8"/>
    <circle cx="38" cy="20" r="6" fill="#fab387"/>
    <circle cx="56" cy="20" r="6" fill="#a6e3a1"/>
    <text x="${svgW / 2}" y="25" font-family="Arial" font-size="13" fill="#6c7086" text-anchor="middle">${escapeXml(title)}</text>
    ${textLines}
  </svg>`;

  return sharp(Buffer.from(svg)).resize(WIDTH, HEIGHT, { fit: "cover" }).png().toBuffer();
}

// ==========================================
// Wallpapers: Use the wallpaper itself as thumbnail
// ==========================================
export async function generateWallpaperThumbnail(
  wallpaperBuffer: Buffer
): Promise<Buffer> {
  return sharp(wallpaperBuffer).resize(WIDTH, HEIGHT, { fit: "cover" }).png().toBuffer();
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
