import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to blog page", async ({ page }) => {
    await page.goto("/");

    // Click blog link
    await page.click('a[href="/blog"]');

    // Verify we're on blog page
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should navigate to tools page", async ({ page }) => {
    await page.goto("/");

    // Navigate to tools
    await page.click('a[href="/tools"]');

    await expect(page).toHaveURL(/\/tools/);
  });

  test("should navigate to guides", async ({ page }) => {
    await page.goto("/");

    // Look for guides link
    const guidesLink = page.locator('a[href*="guides"]').first();
    if (await guidesLink.isVisible()) {
      await guidesLink.click();
      await expect(page).toHaveURL(/\/guides/);
    }
  });

  test("should navigate to privacy policy", async ({ page }) => {
    await page.goto("/privacy");

    await expect(page).toHaveURL(/\/privacy/);
    await expect(page.locator("body")).toContainText(/privacy/i);
  });

  test("should navigate to terms of service", async ({ page }) => {
    await page.goto("/terms");

    await expect(page).toHaveURL(/\/terms/);
    await expect(page.locator("body")).toContainText(/terms/i);
  });

  test("should navigate back to home from blog", async ({ page }) => {
    await page.goto("/blog");

    // Click logo or home link
    const homeLink = page.locator('a[href="/"]').first();
    await homeLink.click();

    await expect(page).toHaveURL("/");
  });
});
