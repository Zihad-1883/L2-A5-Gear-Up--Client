export interface TCreatePaymentSession {
    rentalOrderId: string;
}

export interface TConfirmPayment {
    tran_id: string;
    status: string;
    val_id: string;
    amount: string;
    currency: string;
    store_id: string;
}

export interface TPayment {
    _id?: string;
    id?: string;
    rentalOrderId?: string;
    rentalOrder?: {
        _id?: string;
        id?: string;
        totalPrice?: number;
    };
    userId?: string;
    amount?: number;
    transactionId?: string;
    status?: "PENDING" | "VALID" | "PAID" | "FAILED" | "CANCELLED";
    paymentGatewayData?: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
}
