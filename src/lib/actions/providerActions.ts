"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { TCreateGears } from "@/app/types/gear";

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
        revalidatePath("/dashboard/provider/create-gears");
        return result;
    } catch (error) {
        console.error("Error creating gears:", error);
        return { success: false, message: "Failed to create gears" };
    }
}