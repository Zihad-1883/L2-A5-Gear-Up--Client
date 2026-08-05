export type TCreateGears = {
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
    categoryId: string;
};

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
    createdAt?: string;
    updatedAt?: string;
}