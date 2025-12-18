import Iyzipay from 'iyzipay';

// Lazy initialization to avoid build-time errors
let iyzipay: Iyzipay | null = null;

function getIyzipay(): Iyzipay {
    if (!iyzipay) {
        if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
            throw new Error('Iyzico API credentials not configured');
        }
        iyzipay = new Iyzipay({
            apiKey: process.env.IYZICO_API_KEY,
            secretKey: process.env.IYZICO_SECRET_KEY,
            uri: process.env.IYZICO_BASE_URL || 'https://api.iyzipay.com'
        });
    }
    return iyzipay;
}

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    checkoutFormContent?: string;
    token?: string;
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
        phone?: string;
    };
    callbackUrl: string;
    basketItems: {
        id: string;
        name: string;
        category: string;
        price: string;
    }[];
}

export interface RetrievePaymentParams {
    token: string;
}

class PaymentService {
    /**
     * Initialize Iyzico Checkout Form
     * Returns HTML content to render the payment form
     */
    async createCheckoutForm(params: CreatePaymentParams): Promise<PaymentIntent> {
        return new Promise((resolve, reject) => {
            const request = {
                locale: Iyzipay.LOCALE.TR,
                conversationId: params.metadata?.transactionId || Date.now().toString(),
                price: params.amount.toString(),
                paidPrice: params.amount.toString(),
                currency: Iyzipay.CURRENCY.TRY,
                basketId: params.metadata?.transactionId || `basket_${Date.now()}`,
                paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
                callbackUrl: params.callbackUrl,
                enabledInstallments: [1, 2, 3, 6, 9],
                buyer: {
                    id: params.user.id,
                    name: params.user.name.split(' ')[0] || 'Ad',
                    surname: params.user.name.split(' ').slice(1).join(' ') || 'Soyad',
                    gsmNumber: params.user.phone || '+905350000000',
                    email: params.user.email,
                    identityNumber: '11111111111', // Placeholder - should be collected from user
                    registrationAddress: 'İstanbul, Türkiye',
                    ip: '85.34.78.112',
                    city: 'Istanbul',
                    country: 'Turkey',
                    zipCode: '34000'
                },
                shippingAddress: {
                    contactName: params.user.name,
                    city: 'Istanbul',
                    country: 'Turkey',
                    address: 'İstanbul, Türkiye',
                    zipCode: '34000'
                },
                billingAddress: {
                    contactName: params.user.name,
                    city: 'Istanbul',
                    country: 'Turkey',
                    address: 'İstanbul, Türkiye',
                    zipCode: '34000'
                },
                basketItems: params.basketItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    category1: item.category,
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: item.price
                }))
            };

            getIyzipay().checkoutFormInitialize.create(request, (err: any, result: any) => {
                if (err) {
                    console.error('Iyzico error:', err);
                    reject(err);
                    return;
                }

                if (result.status === 'success') {
                    resolve({
                        id: result.token,
                        amount: params.amount,
                        currency: 'TRY',
                        status: 'PENDING',
                        checkoutFormContent: result.checkoutFormContent,
                        token: result.token
                    });
                } else {
                    console.error('Iyzico result error:', result);
                    reject(new Error(result.errorMessage || 'Payment initialization failed'));
                }
            });
        });
    }

    /**
     * Retrieve payment result after callback
     */
    async retrievePayment(params: RetrievePaymentParams): Promise<{
        status: 'SUCCESS' | 'FAILED';
        paymentId?: string;
        errorMessage?: string;
        paidPrice?: number;
    }> {
        return new Promise((resolve, reject) => {
            const request = {
                locale: Iyzipay.LOCALE.TR,
                conversationId: Date.now().toString(),
                token: params.token
            };

            getIyzipay().checkoutForm.retrieve(request, (err: any, result: any) => {
                if (err) {
                    console.error('Iyzico retrieve error:', err);
                    reject(err);
                    return;
                }

                if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
                    resolve({
                        status: 'SUCCESS',
                        paymentId: result.paymentId,
                        paidPrice: parseFloat(result.paidPrice)
                    });
                } else {
                    resolve({
                        status: 'FAILED',
                        errorMessage: result.errorMessage || 'Payment failed'
                    });
                }
            });
        });
    }

    /**
     * Legacy method for backward compatibility
     * Now uses Iyzico Checkout Form
     */
    async createPaymentIntent(params: {
        amount: number;
        currency?: string;
        description?: string;
        metadata?: Record<string, any>;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }): Promise<PaymentIntent> {
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/app/advertiser/checkout/callback`;

        return this.createCheckoutForm({
            ...params,
            callbackUrl,
            basketItems: [{
                id: params.metadata?.transactionId || 'item_1',
                name: params.description || 'Panobu Reklam Hizmeti',
                category: 'Reklam',
                price: params.amount.toString()
            }]
        });
    }

    /**
     * Verify a payment (called from callback)
     */
    async verifyPayment(token: string): Promise<boolean> {
        try {
            const result = await this.retrievePayment({ token });
            return result.status === 'SUCCESS';
        } catch (error) {
            console.error('Payment verification failed:', error);
            return false;
        }
    }
}

export const paymentService = new PaymentService();
