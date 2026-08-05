import DashboardSidebar from "@/components/shared/DashboardSidebar";
import { verifyToken } from "@/utilis/jwt";
import { cookies } from "next/headers";
import React from "react";
import { TUser } from "@/app/types/userAuthData.type";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const verifiedToken = accessToken ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!) : null;
    const user = verifiedToken?.success && verifiedToken.data ? (verifiedToken.data as unknown as TUser) : null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
            <DashboardSidebar user={user} />
            <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;