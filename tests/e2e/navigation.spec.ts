import { test, expect } from "@playwright/test";

test.describe("Public pages navigation", () => {
    test("homepage loads correctly", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/Panobu/);
    });

    test("static billboards page loads", async ({ page }) => {
        await page.goto("/static-billboards");
        await expect(page.locator("body")).not.toContainText("404");
    });

    test("login page loads", async ({ page }) => {
        await page.goto("/auth/login");
        await expect(page.locator("body")).not.toContainText("404");
    });

    test("register page loads", async ({ page }) => {
        await page.goto("/auth/register");
        await expect(page.locator("body")).not.toContainText("404");
    });

    test("blog page loads", async ({ page }) => {
        await page.goto("/blog");
        await expect(page.locator("body")).not.toContainText("404");
    });

    test("faq page loads", async ({ page }) => {
        await page.goto("/faq");
        await expect(page.locator("body")).not.toContainText("404");
    });

    test("how-it-works page loads", async ({ page }) => {
        await page.goto("/how-it-works");
        await expect(page.locator("body")).not.toContainText("404");
    });

    test("cart page loads", async ({ page }) => {
        await page.goto("/cart");
        await expect(page.locator("body")).not.toContainText("404");
    });
});

test.describe("Protected routes redirect to login", () => {
    test("advertiser dashboard redirects to login", async ({ page }) => {
        await page.goto("/app/advertiser/dashboard");
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test("advertiser billing redirects to login", async ({ page }) => {
        await page.goto("/app/advertiser/billing");
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test("advertiser account redirects to login", async ({ page }) => {
        await page.goto("/app/advertiser/account");
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test("owner dashboard redirects to login", async ({ page }) => {
        await page.goto("/app/owner/dashboard");
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test("owner finance redirects to login", async ({ page }) => {
        await page.goto("/app/owner/finance");
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test("owner account redirects to login", async ({ page }) => {
        await page.goto("/app/owner/account");
        await expect(page).toHaveURL(/\/auth\/login/);
    });
});
