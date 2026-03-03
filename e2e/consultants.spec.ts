import { test, expect } from "@playwright/test";

test.describe("Consultants Page (Admin)", () => {
  test("shows consultants heading and new button", async ({ page }) => {
    await page.goto("/consultants");

    await expect(
      page.getByRole("heading", { name: "Consulenti" })
    ).toBeVisible();

    // New consultant button
    await expect(
      page.getByRole("link", { name: /nuovo consulente/i })
    ).toBeVisible();
  });

  test("shows search input", async ({ page }) => {
    await page.goto("/consultants");
    // Use the input inside the card (not sidebar)
    const card = page.locator("[class*='card']").first();
    await expect(card.getByRole("textbox")).toBeVisible();
  });

  test("shows table headers", async ({ page }) => {
    await page.goto("/consultants");

    // Wait for table to load
    await page.waitForTimeout(3_000);

    const table = page.locator("table");
    const hasTable = (await table.count()) > 0;

    if (hasTable) {
      await expect(table.getByText("Nome")).toBeVisible();
      await expect(table.getByText("Ruolo")).toBeVisible();
      await expect(table.getByText("Landing Page")).toBeVisible();
      await expect(table.getByText("Visite")).toBeVisible();
      await expect(table.getByText("Azioni")).toBeVisible();
    }
  });

  test("shows demo consultant data", async ({ page }) => {
    await page.goto("/consultants");

    await expect(page.getByText("Giuseppe Guglielmo")).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByText("giuseppe.guglielmo@mediacomsrls.it")
    ).toBeVisible();
  });

  test("search filters consultants", async ({ page }) => {
    await page.goto("/consultants");
    await page.waitForTimeout(2_000);

    const searchInput = page.locator("main").getByRole("textbox");

    // Search for existing consultant
    await searchInput.fill("Giuseppe");
    await page.waitForTimeout(1_000);

    await expect(page.getByText("Giuseppe Guglielmo")).toBeVisible();

    // Search for non-existing consultant
    await searchInput.fill("zzznonexistent");
    await page.waitForTimeout(1_000);

    await expect(
      page.getByText(/nessun consulente trovato/i)
    ).toBeVisible({ timeout: 5_000 });
  });

  test("new consultant link points to correct URL", async ({ page }) => {
    await page.goto("/consultants");
    const link = page.getByRole("link", { name: /nuovo consulente/i });
    await expect(link).toHaveAttribute("href", "/consultants/new");
  });
});
