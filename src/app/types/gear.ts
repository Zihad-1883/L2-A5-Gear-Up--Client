export type TCreateGears = {
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
    categoryId: string;
};

export interface TReview {
    _id?: string;
    id?: string;
    gearId?: string;
    gearItemId?: string;
    comment?: string;
    rating?: number;
    user?: {
        name?: string;
        email?: string;
        avatar?: string;
    };
    userName?: string;
    createdAt?: string;
}

export interface TGear {
    _id?: string;
    id?: string;
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
    categoryId?: string | { id?: string; _id?: string; name: string };
    category?: { id?: string; _id?: string; name: string };
    imageUrl?: string;
    images?: string[];
    isAvailable?: boolean;
    reviews?: TReview[];
    rating?: number;
    createdAt?: string;
    updatedAt?: string;
}