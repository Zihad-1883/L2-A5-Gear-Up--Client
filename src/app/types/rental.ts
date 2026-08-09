export type TRentalStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED"
    | "PICKED_UP"
    | "RETURNED";

export interface TCreateRentalOrder {
    gearItemId: string;
    startDate: string;
    endDate: string;
}

export interface TRentalOrder {
    _id?: string;
    id?: string;
    gearItemId?: string;
    gearItem?: {
        _id?: string;
        id?: string;
        name: string;
        brand?: string;
        price?: number;
        imageUrl?: string;
    };
    gear?: {
        _id?: string;
        id?: string;
        name: string;
        brand?: string;
        price?: number;
    };
    userId?: string;
    user?: {
        _id?: string;
        id?: string;
        name?: string;
        email?: string;
    };
    customer?: {
        _id?: string;
        id?: string;
        name?: string;
        email?: string;
    };
    startDate: string;
    endDate: string;
    totalPrice?: number;
    rentalOrderStatus: TRentalStatus;
    paymentStatus?: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
    isReviewed?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
