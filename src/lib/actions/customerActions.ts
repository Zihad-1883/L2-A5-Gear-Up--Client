"use server";

import { TReview } from "@/app/types/gear";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

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
            body: JSON.stringify(reviewData),
            cache: "no-store",
        });
        const data = await res.json();
        console.log("Create Review API Response:", data);

        if (reviewData.gearItemId || reviewData.gearId) {
            revalidatePath(`/gear/${reviewData.gearItemId || reviewData.gearId}`);
        }
        return data;
    } catch (error) {
        console.error("Error creating review:", error);
        return { success: false, message: "Failed to create review" };
    }
}