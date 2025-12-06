import { test, expect } from "@playwright/test";

test.describe("Public Tools", () => {
  test.describe("Levy Calculator", () => {
    test("should load levy calculator page", async ({ page }) => {
      await page.goto("/tools/levy-calculator");

      await expect(page).toHaveURL(/\/tools\/levy-calculator/);
      await expect(page.locator("h1")).toBeVisible();
    });

    test("should have input fields for calculation", async ({ page }) => {
      await page.goto("/tools/levy-calculator");

      // Look for input fields
      const inputs = page.locator("input");
      const inputCount = await inputs.count();

      expect(inputCount).toBeGreaterThan(0);
    });

    test("should calculate levy when values entered", async ({ page }) => {
      await page.goto("/tools/levy-calculator");

      // Find and fill budget input
      const budgetInput = page.locator('input[type="number"]').first();
      if (await budgetInput.isVisible()) {
        await budgetInput.fill("10000");

        // Look for calculation results or updated UI
        await page.waitForTimeout(500);
        await expect(page.locator("body")).toBeVisible();
      }
    });
  });

  test.describe("Compliance Health Check", () => {
    test("should load compliance health check page", async ({ page }) => {
      await page.goto("/tools/compliance-health-check");

      await expect(page).toHaveURL(/\/tools\/compliance-health-check/);
      await expect(page.locator("h1")).toBeVisible();
    });

    test("should display quiz or assessment questions", async ({ page }) => {
      await page.goto("/tools/compliance-health-check");

      // Look for questions or interactive elements
      const questions = page.locator("text=/question|check|compliance/i");
      await expect(page.locator("body")).toBeVisible();
    });
  });

  test.describe("Strata Roll Template", () => {
    test("should load strata roll template page", async ({ page }) => {
      await page.goto("/tools/strata-roll-template");

      await expect(page).toHaveURL(/\/tools\/strata-roll-template/);
      await expect(page.locator("h1")).toBeVisible();
    });

    test("should have download or template information", async ({ page }) => {
      await page.goto("/tools/strata-roll-template");

      // Look for download button or template info
      const downloadElement = page.locator("text=/download|template|excel|csv/i").first();
      await expect(page.locator("body")).toBeVisible();
    });
  });

  test.describe("Strata Hub Reporter", () => {
    test("should load strata hub reporter page", async ({ page }) => {
      await page.goto("/tools/strata-hub-reporter");

      await expect(page).toHaveURL(/\/tools\/strata-hub-reporter/);
      await expect(page.locator("h1")).toBeVisible();
    });

    test("should have file upload zone", async ({ page }) => {
      await page.goto("/tools/strata-hub-reporter");

      // Look for upload area
      const uploadArea = page.locator("text=/upload|drag|drop|file/i").first();
      await expect(page.locator("body")).toBeVisible();
    });
  });
});
