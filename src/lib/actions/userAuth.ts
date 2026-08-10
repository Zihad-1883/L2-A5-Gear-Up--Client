"use server";

import { TLoginUser, TRegisterUser } from "@/app/types/userAuthData.type";
import { cookies } from "next/headers";

const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api";
};

export const registerUser = async (data: TRegisterUser) => {
    try {
        const res = await fetch(`${getBaseUrl()}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            cache: "no-store",
        });
        const result = await res.json();
        return result;
    } catch (error) {
        console.error("Register error:", error);
        return { success: false, message: "Server connection failed. Please try again." };
    }
};

export const loginUser = async (data: TLoginUser) => {
    try {
        const res = await fetch(`${getBaseUrl()}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            cache: "no-store",
        });

        const result = await res.json();

        if (result?.success && result?.data?.accessToken) {
            const cookieStore = await cookies();
            cookieStore.set("accessToken", result.data.accessToken, {
                path: "/",
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            if (result?.data?.refreshToken) {
                cookieStore.set("refreshToken", result.data.refreshToken, {
                    path: "/",
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
            }
        }

        return result;
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Failed to connect to backend server. Please verify backend is running." };
    }
};

export const logoutUser = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
};
