declare module 'iyzipay' {
    interface IyzipayConfig {
        apiKey: string;
        secretKey: string;
        uri: string;
    }

    interface CheckoutFormRequest {
        locale: string;
        conversationId: string;
        price: string;
        paidPrice: string;
        currency: string;
        basketId: string;
        paymentGroup: string;
        callbackUrl: string;
        enabledInstallments: number[];
        buyer: {
            id: string;
            name: string;
            surname: string;
            gsmNumber: string;
            email: string;
            identityNumber: string;
            registrationAddress: string;
            ip: string;
            city: string;
            country: string;
            zipCode: string;
        };
        shippingAddress: {
            contactName: string;
            city: string;
            country: string;
            address: string;
            zipCode: string;
        };
        billingAddress: {
            contactName: string;
            city: string;
            country: string;
            address: string;
            zipCode: string;
        };
        basketItems: Array<{
            id: string;
            name: string;
            category1: string;
            itemType: string;
            price: string;
        }>;
    }

    interface CheckoutFormResult {
        status: string;
        locale: string;
        systemTime: number;
        conversationId: string;
        token: string;
        checkoutFormContent: string;
        tokenExpireTime: number;
        paymentPageUrl: string;
        errorCode?: string;
        errorMessage?: string;
        errorGroup?: string;
    }

    interface CheckoutFormRetrieveRequest {
        locale: string;
        conversationId: string;
        token: string;
    }

    interface CheckoutFormRetrieveResult {
        status: string;
        locale: string;
        systemTime: number;
        conversationId: string;
        paymentId: string;
        paymentStatus: string;
        price: string;
        paidPrice: string;
        currency: string;
        installment: number;
        basketId: string;
        binNumber: string;
        lastFourDigits: string;
        cardAssociation: string;
        cardFamily: string;
        cardType: string;
        fraudStatus: number;
        errorCode?: string;
        errorMessage?: string;
        errorGroup?: string;
    }

    class Iyzipay {
        static LOCALE: {
            TR: string;
            EN: string;
        };
        static CURRENCY: {
            TRY: string;
            EUR: string;
            USD: string;
            GBP: string;
        };
        static PAYMENT_GROUP: {
            PRODUCT: string;
            LISTING: string;
            SUBSCRIPTION: string;
        };
        static BASKET_ITEM_TYPE: {
            PHYSICAL: string;
            VIRTUAL: string;
        };

        constructor(config: IyzipayConfig);

        checkoutFormInitialize: {
            create(request: CheckoutFormRequest, callback: (err: any, result: CheckoutFormResult) => void): void;
        };

        checkoutForm: {
            retrieve(request: CheckoutFormRetrieveRequest, callback: (err: any, result: CheckoutFormRetrieveResult) => void): void;
        };
    }

    export = Iyzipay;
}
