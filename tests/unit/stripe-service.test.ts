import { describe, it, expect, vi } from "vitest";

describe("Stripe service", () => {
    it("should throw when STRIPE_SECRET_KEY is not set", async () => {
        delete process.env.STRIPE_SECRET_KEY;

        const { createCheckoutSession } = await import("@/lib/services/stripe");

        await expect(
            createCheckoutSession({
                amount: 100,
                description: "Test",
                customerEmail: "test@test.com",
                metadata: {},
                successUrl: "http://localhost/success",
                cancelUrl: "http://localhost/cancel",
            })
        ).rejects.toThrow("STRIPE_SECRET_KEY");
    });
});
