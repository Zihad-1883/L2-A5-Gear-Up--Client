import { cookies } from "next/headers"
import { verifyToken } from "./jwt";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API

export const createNewAccessToken = async () => {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
        return {
            success: false,
            message: "Refresh token not found"
        }
    }

    const verifiedToken = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);
    if (!verifiedToken.success) {
        return {
            success: false,
            message: "Invalid refresh token"
        }
    }

    const res = await fetch(`${baseUrl}/auth/refresh-token`, {
        method: "POST",
        headers: {
            cookie: `refreshToken=${refreshToken}`
        },
        cache: "no-store"
    })

    const result = await res.json();

    return result


}