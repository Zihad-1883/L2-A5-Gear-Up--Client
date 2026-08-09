"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { TCategory } from "@/app/types/category";
import { TRentalStatus } from "@/app/types/rental";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

export const getAllUsers = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/admin/users`, {
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
        console.error("Error fetching users:", error);
        return { success: false, data: [] };
    }
};

export const updateUserStatus = async (userId: string, status: "ACTIVE" | "BLOCKED" | string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/admin/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            body: JSON.stringify({
                userStatus: status,
                status: status,
            }),
        });
        const data = await res.json();
        revalidatePath("/dashboard/admin/all-users");
        return data;
    } catch (error) {
        console.error("Error updating user status:", error);
        return { success: false, message: "Failed to update status" };
    }
};

export const createCategory = async (categoryData: TCategory) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        const res = await fetch(`${baseUrl}/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            body: JSON.stringify(categoryData),
            cache: "no-store",
        });
        const data = await res.json();
        revalidatePath("/dashboard/admin/categories");
        return data;
    } catch (error) {
        console.error("Error creating category:", error);
        return { success: false, message: "Failed to create category" };
    }
};

export const getAllGearsAdmin = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        let res = await fetch(`${baseUrl}/admin/gear`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            cache: "no-store",
        });

        if (!res.ok) {
            res = await fetch(`${baseUrl}/gear`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
                },
                cache: "no-store",
            });
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching admin gears:", error);
        return { success: false, data: [] };
    }
};

export const deleteGearAdmin = async (gearItemId: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        let res = await fetch(`${baseUrl}/admin/gear/${gearItemId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            cache: "no-store",
        });

        if (!res.ok) {
            res = await fetch(`${baseUrl}/provider/gear/${gearItemId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
                },
                cache: "no-store",
            });
        }

        const data = await res.json();
        revalidatePath("/dashboard/admin/all-gears");
        return data;
    } catch (error) {
        console.error("Error deleting gear by admin:", error);
        return { success: false, message: "Failed to delete gear" };
    }
};

export const getAllRentalsAdmin = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        let res = await fetch(`${baseUrl}/rentals/admin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            cache: "no-store",
        });

        if (!res.ok) {
            res = await fetch(`${baseUrl}/admin/orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
                },
                cache: "no-store",
            });
        }

        if (!res.ok) {
            res = await fetch(`${baseUrl}/rentals`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
                },
                cache: "no-store",
            });
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching admin rentals:", error);
        return { success: false, data: [] };
    }
};

export const updateOrderStatusAdmin = async (rentalOrderId: string, status: TRentalStatus) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("accessToken")?.value;

        let res = await fetch(`${baseUrl}/admin/orders/${rentalOrderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
            },
            body: JSON.stringify({ rentalOrderStatus: status }),
            cache: "no-store",
        });

        if (!res.ok) {
            res = await fetch(`${baseUrl}/provider/orders/${rentalOrderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}`, cookie: `accessToken=${token}` } : {}),
                },
                body: JSON.stringify({ rentalOrderStatus: status }),
                cache: "no-store",
            });
        }

        const data = await res.json();
        revalidatePath("/dashboard/admin/orders");
        return data;
    } catch (error) {
        console.error("Error updating order status by admin:", error);
        return { success: false, message: "Failed to update order status" };
    }
};
