"use client";

import { useState } from "react";
import { TUser } from "@/app/types/userAuthData.type";
import {
    Users,
    Layers,
    Package,
    PlusCircle,
    PackageCheck,
    CreditCard,
    LayoutDashboard,
    Home,
    LogOut,
    Shield,
    Menu,
    X,
    User as UserIcon,
    ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/lib/actions/userAuth";

export default function DashboardSidebar({ user }: { user: TUser | null }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const role = user?.role?.toUpperCase() || "";

    const adminMenus = [
        {
            name: "Dashboard Home",
            path: "/dashboard/admin",
            icon: LayoutDashboard,
        },
        {
            name: "All Users",
            path: "/dashboard/admin/all-users",
            icon: Users,
        },
        {
            name: "Categories",
            path: "/dashboard/admin/categories",
            icon: Layers,
        },
        {
            name: "All Gears",
            path: "/dashboard/admin/all-gears",
            icon: Package,
        },
        {
            name: "All Orders",
            path: "/dashboard/admin/orders",
            icon: ShoppingBag,
        },
    ];

    const providerMenus = [
        {
            name: "Dashboard Home",
            path: "/dashboard/provider",
            icon: LayoutDashboard,
        },
        {
            name: "Add New Gear",
            path: "/dashboard/provider/create-gears",
            icon: PlusCircle,
        },
        {
            name: "My All Gears",
            path: "/dashboard/provider/my-all-gears",
            icon: PackageCheck,
        },
        {
            name: "Manage Orders",
            path: "/dashboard/provider/orders",
            icon: ShoppingBag,
        },
    ];

    const customerMenus = [
        {
            name: "Dashboard Home",
            path: "/dashboard/customer",
            icon: LayoutDashboard,
        },
        {
            name: "My Orders",
            path: "/dashboard/customer/orders",
            icon: Package,
        },
        {
            name: "My Payments",
            path: "/dashboard/customer/my-payments",
            icon: CreditCard,
        },
    ];

    let currentMenus = customerMenus;
    if (role === "ADMIN") {
        currentMenus = adminMenus;
    } else if (role === "PROVIDER") {
        currentMenus = providerMenus;
    }

    const handleLogout = async () => {
        await logoutUser();
        router.push("/login");
        router.refresh();
    };

    const sidebarContent = (
        <div className="flex h-full flex-col justify-between p-4">
            <div>
                <div className="flex items-center justify-between pb-6 pt-2 px-2 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20">
                            <Shield className="h-5 w-5 stroke-[2.5]" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-white">
                            Dashboard
                        </span>
                    </Link>

                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {user && (
                    <div className="my-4 rounded-xl border border-slate-800/80 bg-slate-800/40 p-3 shadow-inner">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 font-bold text-sm border border-teal-500/30">
                                {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-white truncate">{user.name || "User"}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                            <span className="text-slate-400">Role:</span>
                            <span className="rounded-md bg-teal-500/10 px-2 py-0.5 font-semibold text-teal-400 border border-teal-500/20 text-[11px] uppercase tracking-wider">
                                {role || "USER"}
                            </span>
                        </div>
                    </div>
                )}

                <nav className="mt-2 space-y-1.5">
                    <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Menu Navigation
                    </p>
                    {currentMenus.map((menu) => {
                        const Icon = menu.icon;
                        const isActive = pathname === menu.path;
                        return (
                            <Link
                                key={menu.path}
                                href={menu.path}
                                onClick={() => setIsMobileOpen(false)}
                                className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-teal-500/15 text-teal-300 font-semibold border-l-4 border-teal-400 shadow-sm shadow-teal-500/10"
                                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                                    }`}
                            >
                                <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                                <span>{menu.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="space-y-1.5 border-t border-slate-800 pt-4">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors"
                >
                    <Home className="h-4 w-4 text-slate-500" />
                    Back to Main Site
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <>
            <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3 md:hidden">
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
                    aria-label="Toggle Dashboard Menu"
                >
                    {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>

                <Link href="/" className="flex items-center gap-2">
                    <span className="text-lg font-extrabold tracking-tight text-white">
                        Dashboard
                    </span>
                </Link>
            </div>

            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {sidebarContent}
            </aside>

            <aside className="hidden md:flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0">
                {sidebarContent}
            </aside>
        </>
    );
}