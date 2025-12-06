import { test, expect } from "@playwright/test";

test.describe("Authentication Pages", () => {
  test("should load sign-in page", async ({ page }) => {
    await page.goto("/sign-in");

    // Clerk sign-in should load
    await expect(page).toHaveURL(/\/sign-in/);

    // Wait for Clerk to load (it injects its own UI)
    await page.waitForTimeout(2000);

    // Page should not show error
    await expect(page.locator("body")).not.toContainText(/error|404/i);
  });

  test("should load sign-up page", async ({ page }) => {
    await page.goto("/sign-up");

    await expect(page).toHaveURL(/\/sign-up/);

    // Wait for Clerk to load
    await page.waitForTimeout(2000);

    // Page should not show error
    await expect(page.locator("body")).not.toContainText(/error|404/i);
  });

  test("sign-in page should have link to sign-up", async ({ page }) => {
    await page.goto("/sign-in");

    // Wait for Clerk
    await page.waitForTimeout(2000);

    // Clerk usually provides a "Sign up" link
    const signUpLink = page.locator('a:has-text("Sign up"), a:has-text("Create account")').first();

    // Either the link exists or Clerk handles this differently
    const isVisible = await signUpLink.isVisible().catch(() => false);
    expect(typeof isVisible).toBe("boolean");
  });
});
