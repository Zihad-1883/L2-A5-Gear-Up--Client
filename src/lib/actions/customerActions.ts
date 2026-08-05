"use server";

import { TReview } from "@/app/types/gear";
import { TCreateRentalOrder } from "@/app/types/rental";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

export const createRentalOrder = async (orderData: TCreateRentalOrder) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/rentals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            body: JSON.stringify(orderData),
            cache: "no-store",
        });
        const data = await res.json();
        revalidatePath("/dashboard/customer/orders");
        return data;
    } catch (error) {
        console.error("Error creating rental order:", error);
        return { success: false, message: "Failed to create rental order" };
    }
};

export const getMyRentalOrders = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/rentals`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            cache: "no-store",
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching my rental orders:", error);
        return { success: false, data: [] };
    }
};

export const getSingleRentalOrder = async (rentalOrderId: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/rentals/${rentalOrderId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            cache: "no-store",
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching single rental order:", error);
        return { success: false, data: null };
    }
};

export const cancelRentalOrder = async (rentalOrderId: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/rentals/${rentalOrderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            body: JSON.stringify({ rentalOrderStatus: "CANCELLED" }),
            cache: "no-store",
        });
        const data = await res.json();
        revalidatePath("/dashboard/customer/orders");
        return data;
    } catch (error) {
        console.error("Error cancelling rental order:", error);
        return { success: false, message: "Failed to cancel order" };
    }
};

export const createPaymentSession = async (rentalOrderId: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/payments/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            body: JSON.stringify({ rentalOrderId }),
            cache: "no-store",
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error creating payment session:", error);
        return { success: false, message: "Failed to create payment session" };
    }
};

export const getMyPayments = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/payments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            cache: "no-store",
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching my payments:", error);
        return { success: false, data: [] };
    }
};

export const createReview = async (reviewData: TReview) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            body: JSON.stringify({
                gearItemId: reviewData.gearItemId || reviewData.gearId,
                rating: Number(reviewData.rating) || 5,
                comment: reviewData.comment || "",
            }),
            cache: "no-store",
        });
        const data = await res.json();

        if (reviewData.gearItemId || reviewData.gearId) {
            revalidatePath(`/gear/${reviewData.gearItemId || reviewData.gearId}`);
        }
        return data;
    } catch (error) {
        console.error("Error creating review:", error);
        return { success: false, message: "Failed to create review" };
    }
};