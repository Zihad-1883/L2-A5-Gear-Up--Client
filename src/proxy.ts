import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './utilis/jwt';
import { createNewAccessToken } from './utilis/accessToken';

export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname
    const cookieStore = await cookies();

    let accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const verifiedAccessToken = verifyToken(accessToken as string, process.env.JWT_ACCESS_SECRET as string) || null;
    const verifiedRefreshToken = verifyToken(refreshToken as string, process.env.JWT_REFRESH_SECRET as string) || null;

    if (!verifiedAccessToken && !verifiedRefreshToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (!verifiedAccessToken && verifiedRefreshToken) {
        const newAccessToken = await createNewAccessToken();
        return NextResponse.redirect(new URL(pathName, request.url))
    }

}

export const config = {
    matcher: '/about/:path*',
}