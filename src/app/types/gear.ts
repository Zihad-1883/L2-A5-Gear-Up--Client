export type TCreateGears = {
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
    categoryId: string;
};

export type TGear = {
    _id?: string;
    id?: string;
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
    categoryId?: string | { id?: string; _id?: string; name: string };
    category?: { id?: string; _id?: string; name: string };
    isAvailable?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// {
//   "gearItemId": "c70761fc-0d39-4336-8556-646897e5419e",
//   "rating": 5,
//   "comment": "Absolutely fantastic camping tent! Set up was incredibly easy and it handled heavy monsoon rain without a single leak. Will definitely rent again for our next trip to Bandarban."
// }
export type TReview = {
    gearItemId: string;
    rating: number;
    comment: string;
}