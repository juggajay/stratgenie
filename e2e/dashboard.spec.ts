import { test, expect } from "@playwright/test";

test.describe("Dashboard Authentication", () => {
  test("should redirect to sign-in when accessing dashboard unauthenticated", async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto("/dashboard");

    // Should redirect to sign-in
    await page.waitForURL(/sign-in/, { timeout: 10000 });

    await expect(page).toHaveURL(/sign-in/);
  });

  test("should redirect to sign-in when accessing dashboard/finance unauthenticated", async ({ page }) => {
    await page.goto("/dashboard/finance");

    await page.waitForURL(/sign-in/, { timeout: 10000 });

    await expect(page).toHaveURL(/sign-in/);
  });

  test("should redirect to sign-in when accessing dashboard/guardian unauthenticated", async ({ page }) => {
    await page.goto("/dashboard/guardian");

    await page.waitForURL(/sign-in/, { timeout: 10000 });

    await expect(page).toHaveURL(/sign-in/);
  });

  test("should redirect to sign-in when accessing dashboard/vault unauthenticated", async ({ page }) => {
    await page.goto("/dashboard/vault");

    await page.waitForURL(/sign-in/, { timeout: 10000 });

    await expect(page).toHaveURL(/sign-in/);
  });

  test("should redirect to sign-in when accessing dashboard/billing unauthenticated", async ({ page }) => {
    await page.goto("/dashboard/billing");

    await page.waitForURL(/sign-in/, { timeout: 10000 });

    await expect(page).toHaveURL(/sign-in/);
  });

  test("should redirect to sign-in when accessing onboarding unauthenticated", async ({ page }) => {
    await page.goto("/onboarding");

    await page.waitForURL(/sign-in/, { timeout: 10000 });

    await expect(page).toHaveURL(/sign-in/);
  });
});
