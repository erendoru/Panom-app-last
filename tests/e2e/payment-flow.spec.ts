import { test, expect } from "@playwright/test";

test.describe("Payment flow", () => {
    test("checkout page loads for unauthenticated user", async ({ page }) => {
        await page.goto("/checkout");
        // Should either show checkout or redirect to cart if empty
        const url = page.url();
        expect(url).toMatch(/\/(checkout|cart)/);
    });

    test("advertiser checkout redirects to login when not authenticated", async ({ page }) => {
        await page.goto("/app/advertiser/checkout");
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test("payment create API returns 401 without auth", async ({ request }) => {
        const response = await request.post("/api/payment/create", {
            data: { amount: 100 },
        });
        expect(response.status()).toBe(401);
    });
});
