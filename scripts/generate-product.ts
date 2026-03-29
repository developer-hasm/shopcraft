/**
 * Generate actual digital product files for each category.
 * Returns a Buffer that can be uploaded to Supabase Storage.
 */

import sharp from "sharp";

// ==========================================
// Templates: HTML/CSS landing page
// ==========================================
const TEMPLATE_THEMES = [
  { name: "Startup", primary: "#6366f1", bg: "#f8fafc" },
  { name: "Agency", primary: "#0ea5e9", bg: "#f0f9ff" },
  { name: "Portfolio", primary: "#10b981", bg: "#f0fdf4" },
  { name: "SaaS", primary: "#f59e0b", bg: "#fffbeb" },
  { name: "Minimal", primary: "#171717", bg: "#ffffff" },
];

export function generateTemplate(title: string): Buffer {
  const theme = TEMPLATE_THEMES[Math.floor(Math.random() * TEMPLATE_THEMES.length)];
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: ${theme.bg}; color: #1a1a1a; }
    .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
    .hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; background: linear-gradient(135deg, ${theme.primary}, ${theme.primary}cc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero p { font-size: 1.25rem; color: #666; max-width: 600px; margin: 0 auto 2rem; }
    .btn { display: inline-block; padding: 0.75rem 2rem; background: ${theme.primary}; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.9; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
    .feature { background: white; border-radius: 1rem; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .feature h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    .feature p { color: #666; font-size: 0.95rem; }
    footer { text-align: center; padding: 2rem; color: #999; font-size: 0.85rem; }
  </style>
</head>
<body>
  <section class="hero">
    <div>
      <h1>${title}</h1>
      <p>A beautiful, responsive template built with modern HTML and CSS. Customize it to make it your own.</p>
      <a href="#features" class="btn">Get Started</a>
    </div>
  </section>
  <section class="features" id="features">
    <div class="feature">
      <h3>Responsive Design</h3>
      <p>Looks great on all devices from mobile to desktop.</p>
    </div>
    <div class="feature">
      <h3>Modern CSS</h3>
      <p>Built with CSS Grid, Flexbox, and custom properties.</p>
    </div>
    <div class="feature">
      <h3>Easy to Customize</h3>
      <p>Clean code with clear structure and comments.</p>
    </div>
  </section>
  <footer>Made with ShopCraft &middot; ${theme.name} Theme</footer>
</body>
</html>`;
  return Buffer.from(html, "utf-8");
}

// ==========================================
// Icons: SVG icon set
// ==========================================
const SVG_ICONS = [
  { name: "home", path: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { name: "user", path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { name: "mail", path: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { name: "search", path: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { name: "heart", path: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { name: "star", path: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { name: "settings", path: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  { name: "bell", path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
];

export function generateIconSet(title: string): Buffer {
  const color = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6"][Math.floor(Math.random() * 5)];
  const icons = SVG_ICONS.map(
    (icon) => `  <!-- ${icon.name} -->
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="${icon.path}"/>
  </svg>`
  ).join("\n\n");

  const content = `<!-- ${title} -->
<!-- Generated by ShopCraft -->
<!-- ${SVG_ICONS.length} icons included -->

${icons}
`;
  return Buffer.from(content, "utf-8");
}

// ==========================================
// Graphics: SVG pattern/background
// ==========================================
export function generateGraphic(title: string): Buffer {
  const colors = [
    ["#6366f1", "#8b5cf6", "#a78bfa"],
    ["#f43f5e", "#ec4899", "#f472b6"],
    ["#10b981", "#34d399", "#6ee7b7"],
    ["#f59e0b", "#fbbf24", "#fcd34d"],
  ];
  const palette = colors[Math.floor(Math.random() * colors.length)];
  const shapes = Math.floor(Math.random() * 20) + 15;

  let elements = "";
  for (let i = 0; i < shapes; i++) {
    const x = Math.floor(Math.random() * 1920);
    const y = Math.floor(Math.random() * 1080);
    const r = Math.floor(Math.random() * 150) + 20;
    const color = palette[Math.floor(Math.random() * palette.length)];
    const opacity = (Math.random() * 0.4 + 0.1).toFixed(2);
    elements += `  <circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}"/>\n`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
  <!-- ${title} - Generated by ShopCraft -->
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${palette[0]};stop-opacity:0.1"/>
      <stop offset="100%" style="stop-color:${palette[2]};stop-opacity:0.2"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="#0f172a"/>
  <rect width="1920" height="1080" fill="url(#bg)"/>
${elements}</svg>`;
  return Buffer.from(svg, "utf-8");
}

// ==========================================
// Cheatsheets: Markdown cheatsheet
// ==========================================
const CHEATSHEETS = [
  {
    name: "git",
    content: `# Git Cheatsheet
> Generated by ShopCraft

## Basic Commands
| Command | Description |
|---------|-------------|
| \`git init\` | Initialize a new repository |
| \`git clone <url>\` | Clone a remote repository |
| \`git add .\` | Stage all changes |
| \`git commit -m "msg"\` | Commit staged changes |
| \`git push\` | Push to remote |
| \`git pull\` | Pull from remote |

## Branching
| Command | Description |
|---------|-------------|
| \`git branch\` | List branches |
| \`git branch <name>\` | Create branch |
| \`git checkout <name>\` | Switch branch |
| \`git merge <name>\` | Merge branch |
| \`git branch -d <name>\` | Delete branch |

## Advanced
| Command | Description |
|---------|-------------|
| \`git stash\` | Stash changes |
| \`git stash pop\` | Apply stashed changes |
| \`git rebase <branch>\` | Rebase onto branch |
| \`git cherry-pick <hash>\` | Apply specific commit |
| \`git log --oneline\` | Compact log view |`,
  },
  {
    name: "css-flexbox",
    content: `# CSS Flexbox Cheatsheet
> Generated by ShopCraft

## Container Properties
| Property | Values |
|----------|--------|
| \`display\` | \`flex\`, \`inline-flex\` |
| \`flex-direction\` | \`row\`, \`column\`, \`row-reverse\`, \`column-reverse\` |
| \`flex-wrap\` | \`nowrap\`, \`wrap\`, \`wrap-reverse\` |
| \`justify-content\` | \`flex-start\`, \`center\`, \`flex-end\`, \`space-between\`, \`space-around\` |
| \`align-items\` | \`stretch\`, \`flex-start\`, \`center\`, \`flex-end\`, \`baseline\` |
| \`gap\` | \`10px\`, \`1rem\` |

## Item Properties
| Property | Values |
|----------|--------|
| \`flex-grow\` | \`0\` (default), \`1\`, etc. |
| \`flex-shrink\` | \`1\` (default), \`0\`, etc. |
| \`flex-basis\` | \`auto\`, \`100px\`, \`50%\` |
| \`flex\` | \`1\` (shorthand for grow shrink basis) |
| \`align-self\` | \`auto\`, \`flex-start\`, \`center\`, \`flex-end\` |
| \`order\` | \`0\` (default), \`-1\`, \`1\`, etc. |

## Common Patterns
\`\`\`css
/* Center everything */
.center { display: flex; justify-content: center; align-items: center; }

/* Sidebar layout */
.layout { display: flex; }
.sidebar { flex: 0 0 250px; }
.main { flex: 1; }

/* Equal columns */
.columns { display: flex; gap: 1rem; }
.columns > * { flex: 1; }
\`\`\``,
  },
  {
    name: "react-hooks",
    content: `# React Hooks Cheatsheet
> Generated by ShopCraft

## Basic Hooks
### useState
\`\`\`tsx
const [count, setCount] = useState(0);
setCount(prev => prev + 1);
\`\`\`

### useEffect
\`\`\`tsx
useEffect(() => {
  // runs on mount & dependency change
  return () => { /* cleanup */ };
}, [dependency]);
\`\`\`

### useContext
\`\`\`tsx
const value = useContext(MyContext);
\`\`\`

## Additional Hooks
| Hook | Purpose |
|------|---------|
| \`useReducer\` | Complex state logic |
| \`useCallback\` | Memoize functions |
| \`useMemo\` | Memoize values |
| \`useRef\` | Mutable ref / DOM access |
| \`useId\` | Generate unique IDs |

## React 19 New Hooks
| Hook | Purpose |
|------|---------|
| \`useActionState\` | Form action state |
| \`useFormStatus\` | Pending form status |
| \`useOptimistic\` | Optimistic updates |
| \`use\` | Read resources in render |`,
  },
];

export function generateCheatsheet(title: string): Buffer {
  const sheet = CHEATSHEETS[Math.floor(Math.random() * CHEATSHEETS.length)];
  const content = `${sheet.content}\n\n---\n*${title} - Downloaded from ShopCraft*\n`;
  return Buffer.from(content, "utf-8");
}

// ==========================================
// Wallpapers: Generated with sharp
// ==========================================
export async function generateWallpaper(title: string): Promise<Buffer> {
  const W = 1920;
  const H = 1080;
  const palettes = [
    ["#0f172a", "#1e293b", "#6366f1", "#818cf8"],
    ["#0f172a", "#1e1a2e", "#ec4899", "#f472b6"],
    ["#0a0a0a", "#171717", "#10b981", "#34d399"],
    ["#1a1a2e", "#16213e", "#0ea5e9", "#38bdf8"],
    ["#1c1917", "#292524", "#f59e0b", "#fbbf24"],
  ];
  const p = palettes[Math.floor(Math.random() * palettes.length)];

  let circles = "";
  for (let i = 0; i < 25; i++) {
    const cx = Math.floor(Math.random() * W);
    const cy = Math.floor(Math.random() * H);
    const r = Math.floor(Math.random() * 300) + 50;
    const color = p[2 + Math.floor(Math.random() * 2)];
    const opacity = (Math.random() * 0.15 + 0.03).toFixed(2);
    circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
  }

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${p[0]}"/>
    <rect width="${W}" height="${H}" fill="${p[1]}" opacity="0.5"/>
    ${circles}
    <text x="${W / 2}" y="${H - 40}" font-family="Arial" font-size="14" fill="white" opacity="0.3" text-anchor="middle">ShopCraft Wallpaper</text>
  </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}
