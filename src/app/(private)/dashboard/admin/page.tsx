import { getAllUsers } from "@/lib/actions/adminActions";
import { cookies } from "next/headers";
import { verifyToken } from "@/utilis/jwt";
import Link from "next/link";
import {
    Users,
    FolderPlus,
    ShieldCheck,
    UserX,
    ArrowRight,
    Sparkles,
    Shield,
    Calendar,
    Package,
    Activity,
    CheckCircle2,
} from "lucide-react";
import { TUpdateUser } from "@/app/types/updateUser";
import { getAllCategories } from "@/lib/actions/publicActions";

export const dynamic = "force-dynamic";

const AdminDashboardPage = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const verifiedToken = accessToken
        ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!)
        : null;
    const currentUser = verifiedToken?.success && verifiedToken.data ? verifiedToken.data : null;

    const [usersRes, categoriesRes] = await Promise.all([
        getAllUsers(),
        getAllCategories(),
    ]);

    const users: TUpdateUser[] = Array.isArray(usersRes) ? usersRes : usersRes?.data || [];
    const categories: TCategory[] = Array.isArray(categoriesRes)
        ? categoriesRes
        : categoriesRes?.data || categoriesRes?.result || [];

    const totalUsers = users.length;
    const activeUsers = users.filter(
        (u) => u.userStatus?.toUpperCase() === "ACTIVE" || !u.userStatus
    ).length;
    const blockedUsers = users.filter((u) => u.userStatus?.toUpperCase() === "BLOCKED").length;

    const recentUsers = users.slice(0, 5);

    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="space-y-8">

            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Administrator Workspace</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                            Welcome back,{" "}
                            <span className="bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                                {currentUser?.name || "Admin"}
                            </span>
                        </h1>
                        <p className="text-sm text-slate-400 max-w-xl">
                            Here is an overview of platform metrics, user activity, gear categories, and quick administrative controls.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/60 border border-slate-800/80 px-4 py-2.5 rounded-2xl w-fit">
                        <Calendar className="h-4 w-4 text-teal-400" />
                        <span>{currentDate}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-teal-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Total Users</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            <Users className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-white">{totalUsers}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-emerald-400 font-semibold">{activeUsers} active</span>
                        <span>•</span>
                        <span className="text-rose-400 font-semibold">{blockedUsers} blocked</span>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-teal-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Categories</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <FolderPlus className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-white">{categories.length}</p>
                    <p className="mt-2 text-xs text-slate-400">Active gear categories</p>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-teal-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Active Accounts</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-emerald-400">{activeUsers}</p>
                    <p className="mt-2 text-xs text-slate-400">
                        {totalUsers > 0 ? `${Math.round((activeUsers / totalUsers) * 100)}% of total users` : "No users"}
                    </p>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-teal-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">System Health</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            <Activity className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-xl font-extrabold text-white">Operational</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">All services running normal</p>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-teal-400" />
                    Quick Administrative Actions
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <Link
                        href="/dashboard/admin/all-users"
                        className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-teal-500/40 hover:bg-slate-900/90 transition-all active:scale-[0.99]"
                    >
                        <div className="space-y-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base group-hover:text-teal-300 transition-colors">
                                    Manage All Users
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    View user profiles, change statuses, block or reactivate accounts.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform">
                            <span>Open User Management</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/admin/categories"
                        className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-teal-500/40 hover:bg-slate-900/90 transition-all active:scale-[0.99]"
                    >
                        <div className="space-y-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                <FolderPlus className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                                    Manage Gear Categories
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Add new equipment categories with names and descriptions.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                            <span>Open Category Management</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/admin/all-gears"
                        className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-teal-500/40 hover:bg-slate-900/90 transition-all active:scale-[0.99]"
                    >
                        <div className="space-y-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                                    All Registered Gears
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Inspect and monitor all rental listings submitted across the platform.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
                            <span>View All Gears</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
                        <Users className="h-4 w-4 text-teal-400" />
                        Recent Users ({recentUsers.length})
                    </h2>

                    <Link
                        href="/dashboard/admin/all-users"
                        className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
                    >
                        <span>View All Users</span>
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
                    {recentUsers.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-500">No users found.</div>
                    ) : (
                        <div className="divide-y divide-slate-800/80">
                            {recentUsers.map((user, idx) => {
                                const isBlocked = user.userStatus?.toUpperCase() === "BLOCKED";
                                return (
                                    <div
                                        key={user.id || `user-${idx}`}
                                        className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-teal-400 font-bold text-xs">
                                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">{user.name || "N/A"}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                                                <Shield className="h-3 w-3" />
                                                {user.role || "CUSTOMER"}
                                            </span>

                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${isBlocked
                                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                                    }`}
                                            >
                                                {isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;