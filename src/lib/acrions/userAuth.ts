import { TLoginUser, TRegisterUser } from "@/app/types/userAuthData.type";

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
    return result;
}