"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { TCreateGears } from "@/app/types/gear";
import { TRentalStatus } from "@/app/types/rental";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

export const createGears = async (data: TCreateGears) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/provider/gear`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            body: JSON.stringify(data),
            cache: "no-store",
        });
        const result = await res.json();
        console.log("createGears response:", JSON.stringify(result, null, 2));
        revalidatePath("/dashboard/provider/create-gears");
        return result;
    } catch (error) {
        console.error("Error creating gears:", error);
        return { success: false, message: "Failed to create gears" };
    }
};

export const updateGear = async (gearItemId: string, data: Partial<TCreateGears>) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/provider/gear/${gearItemId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            body: JSON.stringify(data),
            cache: "no-store",
        });
        const result = await res.json();
        revalidatePath("/dashboard/provider/my-all-gears");
        return result;
    } catch (error) {
        console.error("Error updating gear:", error);
        return { success: false, message: "Failed to update gear" };
    }
};

export const deleteGear = async (gearItemId: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/provider/gear/${gearItemId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            cache: "no-store",
        });
        const result = await res.json();
        revalidatePath("/dashboard/provider/my-all-gears");
        return result;
    } catch (error) {
        console.error("Error deleting gear:", error);
        return { success: false, message: "Failed to delete gear" };
    }
};

export const getProviderOrders = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/provider/orders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            cache: "no-store",
        });
        const result = await res.json();
        return result;
    } catch (error) {
        console.error("Error fetching provider orders:", error);
        return { success: false, data: [] };
    }
};

export const getProviderGears = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/provider/gear`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            cache: "no-store",
        });
        const result = await res.json();
        return result;
    } catch (error) {
        console.error("Error fetching provider gears:", error);
        return { success: false, data: [] };
    }
};

export const updateOrderStatus = async (rentalOrderId: string, status: TRentalStatus) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/provider/orders/${rentalOrderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            body: JSON.stringify({ rentalOrderStatus: status }),
            cache: "no-store",
        });
        const result = await res.json();
        revalidatePath("/dashboard/provider/orders");
        return result;
    } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, message: "Failed to update order status" };
    }
};