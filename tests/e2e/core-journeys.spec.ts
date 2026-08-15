import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("public and role-scoped journeys are honest", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /More time for care/ })).toBeVisible();
  await expect(page.getByText("Synthetic identities only")).toBeVisible();

  await page.goto("/today");
  await expect(page.getByRole("heading", { name: "Good morning, Jordan." })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Synthetic identities only");

  await page.goto("/parent");
  await expect(page.getByRole("heading", { name: "Hello, Avery." })).toBeVisible();
  await expect(page.locator('a[href="/parent/attendance"]').first()).toHaveAttribute(
    "href",
    "/parent/attendance",
  );
});

test("attendance returns an honest non-persisting receipt", async ({ page }) => {
  await page.goto("/attendance", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Check out Maya Chen/ }).click();
  await expect(
    page.getByText("Server validated a synthetic demo receipt. No operational record was changed."),
  ).toBeVisible();
});

test("care events remain private drafts", async ({ page }) => {
  await page.goto("/care-log", { waitUntil: "networkidle" });
  await page.getByLabel("Neutral structured detail").pressSequentially("Synthetic garden activity");
  await page.getByRole("button", { name: "Save private draft" }).click();
  await expect(page.getByText("Synthetic garden activity")).toBeVisible();
  await expect(page.getByText("private draft", { exact: true })).toBeVisible();
});

test("Care Copilot proposes then waits for review", async ({ page }) => {
  await page.goto("/today", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Create review proposal" }).click();
  await expect(page.getByText("Proposal - no mutation")).toBeVisible();
  await page.getByRole("button", { name: "Approve for validation" }).click();
  await expect(page.getByText("No publication or database mutation occurred.")).toBeVisible();
});

test("invoice PDF is downloadable and synthetic", async ({ request }) => {
  const response = await request.get("/api/invoices/55555555-5555-4555-8555-555555555551/pdf");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect(response.headers()["content-disposition"]).toContain("DEMO");
});

for (const route of ["/", "/today", "/attendance", "/parent"] as const) {
  test(`@a11y ${route} has no serious automated accessibility violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
    expect(
      results.violations.filter(
        (violation) => violation.impact === "critical" || violation.impact === "serious",
      ),
    ).toEqual([]);
  });
}

test("mobile layout has no horizontal document overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/today");
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});
