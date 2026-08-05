import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { createNewAccessToken } from './utilis/accessToken';
import { verifyToken } from './utilis/jwt';

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/about", "/contact"];
const ADMIN_ROUTES = ["/dashboard/admin"];
const CUSTOMER_ROUTES = ["/dashboard/customer"];
const PROVIDER_ROUTES = ["/dashboard/provider"];

export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    const cookieStore = await cookies();

    let accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    let verifiedAccessToken = accessToken ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET) : null;
    const verifiedRefreshToken = refreshToken ? verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET) : null;

    if ((!verifiedAccessToken || !verifiedAccessToken.success) && verifiedRefreshToken?.success) {
        const result = await createNewAccessToken();
        if (result?.success && result?.data?.accessToken) {
            const newAccessToken = result.data.accessToken;
            cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "none",
                maxAge: 60 * 60
            });

            accessToken = newAccessToken;
            verifiedAccessToken = verifyToken(accessToken, process.env.JWT_ACCESS_SECRET);
        }
    }

    if (accessToken && verifiedAccessToken && !verifiedAccessToken.success) {
        cookieStore.delete("accessToken");
    }

    let userRole: string | null = null;
    if (verifiedAccessToken?.success && verifiedAccessToken.data) {
        userRole = verifiedAccessToken.data.role;
    }

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));
    const isCustomerRoute = CUSTOMER_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));
    const isProviderRoute = PROVIDER_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));

    if (verifiedAccessToken?.success && isAuthRoute) {
        const redirectUrl = request.nextUrl.searchParams.get("redirect");
        if (redirectUrl) {
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }

        if (userRole === "CUSTOMER") {
            return NextResponse.redirect(new URL("/dashboard/customer", request.url));
        } else if (userRole === "PROVIDER") {
            return NextResponse.redirect(new URL("/dashboard/provider", request.url));
        } else if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        }
    }

    if (!verifiedAccessToken?.success && !isPublicRoute && !isAuthRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathName);
        return NextResponse.redirect(loginUrl);
    }

    if (verifiedAccessToken?.success) {
        if (userRole === "CUSTOMER" && (isAdminRoute || isProviderRoute)) {
            return NextResponse.redirect(new URL("/dashboard/customer", request.url));
        }
        if (userRole === "PROVIDER" && (isAdminRoute || isCustomerRoute)) {
            return NextResponse.redirect(new URL("/dashboard/provider", request.url));
        }
        if (userRole === "ADMIN" && (isCustomerRoute || isProviderRoute)) {
            return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|.*\\.png$).*)',
}