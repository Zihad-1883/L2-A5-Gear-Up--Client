"use server";

import { TLoginUser, TRegisterUser } from "@/app/types/userAuthData.type";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

export const registerUser = async (data: TRegisterUser) => {
    const res = await fetch(`${baseUrl}/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    return result;
}

export const loginUser = async (data: TLoginUser) => {
    const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();

    if (result?.success && result?.data?.accessToken) {
        const cookieStore = await cookies();
        cookieStore.set("accessToken", result.data.accessToken);
        if (result?.data?.refreshToken) {
            cookieStore.set("refreshToken", result.data.refreshToken);
        }
    }

    return result;
}

export const logoutUser = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
}