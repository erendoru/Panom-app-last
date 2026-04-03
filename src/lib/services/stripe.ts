import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not configured");
        }
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripeInstance;
}

export interface CreateCheckoutParams {
    amount: number;
    currency?: string;
    description: string;
    metadata: Record<string, string>;
    customerEmail: string;
    successUrl: string;
    cancelUrl: string;
    lineItems?: {
        name: string;
        amount: number;
        quantity: number;
    }[];
}

export async function createCheckoutSession(params: CreateCheckoutParams) {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: params.customerEmail,
        metadata: params.metadata,
        line_items: params.lineItems
            ? params.lineItems.map((item) => ({
                  price_data: {
                      currency: params.currency || "try",
                      product_data: { name: item.name },
                      unit_amount: Math.round(item.amount * 100),
                  },
                  quantity: item.quantity,
              }))
            : [
                  {
                      price_data: {
                          currency: params.currency || "try",
                          product_data: { name: params.description },
                          unit_amount: Math.round(params.amount * 100),
                      },
                      quantity: 1,
                  },
              ],
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
    });

    return {
        sessionId: session.id,
        url: session.url,
    };
}

export async function retrieveCheckoutSession(sessionId: string) {
    const stripe = getStripe();
    return stripe.checkout.sessions.retrieve(sessionId);
}

export function constructWebhookEvent(payload: string | Buffer, signature: string) {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
