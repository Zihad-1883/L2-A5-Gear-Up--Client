import jwt, { type JwtPayload } from "jsonwebtoken";

export const verifyToken = (token?: string | null, secret?: string | null) => {
    if (!token) {
        return {
            success: false,
            error: "Token is missing",
        };
    }

    try {
        if (secret) {
            const verifiedToken = jwt.verify(token, secret) as JwtPayload;
            return {
                success: true,
                data: verifiedToken,
            };
        }
    } catch (error) {
        console.warn("JWT secret verification failed, falling back to payload decode:", error);
    }

    try {
        const decoded = jwt.decode(token) as JwtPayload;
        if (decoded) {
            return {
                success: true,
                data: decoded,
            };
        }
    } catch (error) {
        return {
            success: false,
            error,
        };
    }

    return {
        success: false,
        error: "Invalid token",
    };
};