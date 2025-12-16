
export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    clientSecret?: string; // For Stripe/Iyzico later
}

export interface CreatePaymentParams {
    amount: number;
    currency?: string;
    description?: string;
    metadata?: Record<string, any>;
    user: {
        id: string;
        email: string;
        name: string;
    }
}

class PaymentService {
    /**
     * Initialize a payment session.
     * For the mock, this just returns a success intent immediately or after a delay simulation.
     */
    async createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent> {
        console.log("Creating payment intent for:", params);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            id: `mock_pay_${Math.random().toString(36).substring(7)}`,
            amount: params.amount,
            currency: params.currency || "TRY",
            status: 'PENDING',
            clientSecret: "mock_secret_key"
        };
    }

    /**
     * Verify a payment (e.g. from webhook or callback)
     */
    async verifyPayment(paymentId: string): Promise<boolean> {
        console.log("Verifying payment:", paymentId);
        // specific logic to check Iyzico/Stripe
        return true;
    }
}

export const paymentService = new PaymentService();
