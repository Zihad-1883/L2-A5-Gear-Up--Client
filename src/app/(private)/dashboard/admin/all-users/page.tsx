import { getAllUsers } from "@/lib/actions/adminActions";
import AllUsersTable from "@/components/dashboard/AllUsersTable";
import { Users, ShieldCheck, UserX } from "lucide-react";
import { TUpdateUser } from "@/app/types/updateUser";
import { cookies } from "next/headers";
import { verifyToken } from "@/utilis/jwt";

const AllUsersPage = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const verifiedToken = accessToken ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!) : null;
    const currentUser = verifiedToken?.success && verifiedToken.data ? verifiedToken.data : null;

    const result = await getAllUsers();
    const users = Array.isArray(result) ? result : result?.data || [];

    const totalUsers = users.length;
    const activeUsers = users.filter((u: TUpdateUser) => u.userStatus?.toUpperCase() === "ACTIVE" || !u.userStatus).length;
    const blockedUsers = users.filter((u: TUpdateUser) => u.userStatus?.toUpperCase() === "BLOCKED").length;

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">All System Users</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Manage and monitor all customer, provider, and administrator accounts across the platform.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400">Total Users</p>
                            <p className="text-xl font-extrabold text-white">{totalUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400">Active Accounts</p>
                            <p className="text-xl font-extrabold text-emerald-400">{activeUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <UserX className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400">Blocked Accounts</p>
                            <p className="text-xl font-extrabold text-rose-400">{blockedUsers}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="text-base font-bold text-slate-200">Registered Users List</h2>
                <AllUsersTable
                    users={users}
                    currentUserId={currentUser?.id || currentUser?._id}
                    currentUserEmail={currentUser?.email}
                />
            </div>
        </div>
    );
};

export default AllUsersPage;