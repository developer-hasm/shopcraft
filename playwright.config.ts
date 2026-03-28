import { defineConfig } from "@playwright/test";

const BASE_URL = "https://shopcraft-seven.vercel.app";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  use: {
    baseURL: BASE_URL,
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
