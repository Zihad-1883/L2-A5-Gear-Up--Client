import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './utilis/jwt';
import { createNewAccessToken } from './utilis/accessToken';

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/about", "/contact"];
const ADMIN_ROUTES = ["/dashboard/admin"];
const CUSTOMER_ROUTES = ["/dashboard/customer"];
const PROVIDER_ROUTES = ["/dashboard/provider"];

export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname
    const cookieStore = await cookies();

    let accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    let verifiedAccessToken = verifyToken(accessToken as string, process.env.JWT_ACCESS_SECRET as string) || null;
    const verifiedRefreshToken = verifyToken(refreshToken as string, process.env.JWT_REFRESH_SECRET as string) || null;

    if (!verifiedAccessToken && !verifiedRefreshToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (!verifiedAccessToken && verifiedRefreshToken) {
        const result = await createNewAccessToken();
        if (result.success) {
            const newAccessToken = result.data.accessToken;
            cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "none",
                maxAge: 60 * 60
            });

            accessToken = newAccessToken;
            verifiedAccessToken = verifyToken(accessToken as string, process.env.JWT_ACCESS_SECRET as string);
        }
    }

    if (!verifiedAccessToken.success) {
        cookieStore.delete("accessToken")
    }

    let userRole = null;

    if (verifiedAccessToken?.success && verifiedAccessToken.data) {
        userRole = verifiedAccessToken.data.role;
    }


    if (accessToken && AUTH_ROUTES.includes(pathName)) {
        if (userRole === "CUSTOMER") {
            return NextResponse.redirect(new URL("/dashboard/customer", request.url));
        } else if (userRole === "PROVIDER") {
            return NextResponse.redirect(new URL("/dashboard/provider", request.url));
        } else if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        }
    }

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));
    const isCustomerRoute = CUSTOMER_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));
    const isProviderRoute = PROVIDER_ROUTES.some((route) => pathName === route || pathName.startsWith(route + "/"));

    if (!accessToken || !isPublicRoute || !isAuthRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathName);
        return NextResponse.redirect(loginUrl);
    }

    if (accessToken && !isCustomerRoute && userRole === "CUSTOMER") {
        return NextResponse.redirect(new URL("/dashboard/customer", request.url));
    }

    if (accessToken && !isProviderRoute && userRole === "PROVIDER") {
        return NextResponse.redirect(new URL("/dashboard/provider", request.url));
    }

    if (accessToken && !isAdminRoute && userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }



}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|.*\\.png$).*)',
}