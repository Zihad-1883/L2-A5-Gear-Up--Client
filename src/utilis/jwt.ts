import jwt, { type JwtPayload } from "jsonwebtoken"

export const verifyToken = (token?: string | null, secret?: string | null) => {
    if (!token || !secret) {
        return {
            success: false,
            error: "Token or secret is missing"
        }
    }

    try {
        const verifiedToken = jwt.verify(token, secret) as JwtPayload
        return {
            success: true,
            data: verifiedToken
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
}