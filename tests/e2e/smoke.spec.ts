import { test, expect } from "@playwright/test";

test.describe("Smoke Tests - ShopCraft", () => {
  test("홈페이지 로딩", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ShopCraft/);
    await expect(page.locator("text=Discover & Sell")).toBeVisible();
    await expect(page.locator("text=Featured Products")).toBeVisible();
  });

  test("상품 목록 페이지", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("h1")).toContainText("Products");
    // 카테고리 필터 버튼 존재
    await expect(page.getByRole("link", { name: "All", exact: true })).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: "Templates", exact: true })).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: "Icons", exact: true })).toBeVisible();
  });

  test("카테고리 필터 동작", async ({ page }) => {
    await page.goto("/products");
    await page.click("a:has-text('Icons')");
    await expect(page).toHaveURL(/category=icons/);
  });

  test("상품 상세 페이지 접근", async ({ page }) => {
    await page.goto("/products");
    // 첫 번째 상품 카드 클릭
    const firstCard = page.locator("a[href^='/products/']").first();
    await firstCard.click();
    await expect(page.locator("text=Back to Products")).toBeVisible();
    // 가격 표시 확인
    await expect(page.locator("text=₩")).toBeVisible();
  });

  test("로그인 페이지", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=Welcome back")).toBeVisible();
    await expect(page.locator("text=Continue with Google")).toBeVisible();
    await expect(page.locator("input[name='email']")).toBeVisible();
    await expect(page.locator("input[name='password']")).toBeVisible();
  });

  test("회원가입 페이지", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("text=Create an account")).toBeVisible();
    await expect(page.locator("input[name='name']")).toBeVisible();
    await expect(page.locator("input[name='email']")).toBeVisible();
    await expect(page.locator("input[name='password']")).toBeVisible();
  });

  test("미인증 대시보드 접근 → 로그인 리다이렉트", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/login/);
    await expect(page).toHaveURL(/login/);
  });

  test("존재하지 않는 상품 → 404", async ({ page }) => {
    await page.goto("/products/00000000-0000-0000-0000-000000000000");
    await expect(page.getByRole("heading", { name: "Product Not Found" })).toBeVisible();
  });

  test("결제 성공 페이지 접근", async ({ page }) => {
    await page.goto("/checkout/success");
    await expect(page.locator("text=Payment Successful")).toBeVisible();
  });

  test("결제 취소 페이지 접근", async ({ page }) => {
    await page.goto("/checkout/cancel");
    await expect(page.locator("text=Payment Cancelled")).toBeVisible();
  });

  test("검색 기능", async ({ page }) => {
    await page.goto("/products");
    await page.fill("input[name='q']", "Dashboard");
    await page.press("input[name='q']", "Enter");
    await expect(page).toHaveURL(/q=Dashboard/);
  });

  test("헤더 네비게이션 링크", async ({ page }) => {
    await page.goto("/");
    // Products 링크 존재
    await expect(page.locator("nav >> text=Products").first()).toBeVisible();
  });

  test("푸터 존재", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "ShopCraft" })).toBeVisible();
  });

  test("비로그인 상태에서 Buy Now → Sign in to Buy 표시", async ({ page }) => {
    await page.goto("/products");
    const firstCard = page.locator("a[href^='/products/']").first();
    await firstCard.click();
    await expect(page.locator("text=Sign in to Buy")).toBeVisible();
  });

  test("로그인 실패 시 에러 메시지", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[name='email']", "wrong@test.com");
    await page.fill("input[name='password']", "wrongpassword");
    await page.click("button:has-text('Sign In')");
    await expect(page.locator("text=Invalid email or password")).toBeVisible({
      timeout: 10000,
    });
  });
});
