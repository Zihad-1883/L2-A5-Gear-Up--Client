"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Shield, Menu, X, User, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TUser } from "@/app/types/userAuthData.type";
import { logoutUser } from "@/lib/acrions/userAuth";
import { useRouter } from "next/navigation";

export default function Navbar({ user }: { user: TUser | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const publicRoutes = [
        {
            name: "Browse Gears",
            url: "/gear"
        },
        {
            name: "About Us",
            url: "/about"
        },
        {
            name: "Contact",
            url: "/contact"
        }
    ];

    const authRoutes = [
        {
            name: "Login",
            url: "/login"
        },
        {
            name: "Register",
            url: "/register"
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        setIsUserMenuOpen(false);
        setIsOpen(false);
        router.push("/login");
        router.refresh();
    };

    const getDashboardPath = () => {
        if (!user?.role) return "/dashboard";
        return `/dashboard/${user.role.toLowerCase()}`;
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20">
                        <Shield className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-white">
                        Gear<span className="text-teal-400">Up</span>
                    </span>
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    {publicRoutes.map((route) => (
                        <Link
                            key={route.url}
                            href={route.url}
                            className="text-sm font-medium text-slate-300 transition-colors hover:text-teal-400"
                        >
                            {route.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    {user ? (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2.5 rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-sm font-medium text-slate-200 transition-all hover:border-teal-500/50 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 font-semibold text-xs">
                                    {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
                                </div>
                                <span className="max-w-[120px] truncate">{user.name || "User"}</span>
                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900/95 p-2.5 shadow-2xl shadow-slate-950 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                                    <div className="border-b border-slate-800 px-3 pb-3 pt-1">
                                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                        <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                                        <div className="mt-2 inline-flex items-center rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-400 border border-teal-500/20">
                                            {user.role}
                                        </div>
                                    </div>

                                    <div className="py-1">
                                        <Link
                                            href={getDashboardPath()}
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-teal-400"
                                        >
                                            <LayoutDashboard className="h-4 w-4 text-teal-400" />
                                            Dashboard
                                        </Link>
                                    </div>

                                    <div className="border-t border-slate-800 pt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        authRoutes.map((route) => (
                            <Button key={route.url} asChild variant={route.url === "/register" ? "default" : "outline"} size="sm">
                                <Link href={route.url}>{route.name}</Link>
                            </Button>
                        ))
                    )}
                </div>

                <div className="flex md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="border-t border-slate-800 bg-slate-900 px-4 py-4 md:hidden">
                    <div className="flex flex-col space-y-3">
                        {user && (
                            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-3.5 mb-1">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 font-bold text-sm">
                                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-400 border border-teal-500/20 uppercase tracking-wider">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        )}

                        {publicRoutes.map((route) => (
                            <Link
                                key={route.url}
                                href={route.url}
                                onClick={() => setIsOpen(false)}
                                className="text-sm font-medium text-slate-300 hover:text-teal-400 py-1"
                            >
                                {route.name}
                            </Link>
                        ))}

                        {user ? (
                            <div className="pt-2 flex flex-col gap-2 border-t border-slate-800">
                                <Button asChild variant="outline" size="sm" className="w-full justify-start gap-2">
                                    <Link href={getDashboardPath()} onClick={() => setIsOpen(false)}>
                                        <LayoutDashboard className="h-4 w-4 text-teal-400" />
                                        Dashboard
                                    </Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="w-full justify-start gap-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 border border-rose-500/20"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="pt-2 flex flex-col gap-2 border-t border-slate-800">
                                <Button asChild variant="outline" size="sm" className="w-full">
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        Login
                                    </Link>
                                </Button>
                                <Button asChild variant="default" size="sm" className="w-full">
                                    <Link href="/register" onClick={() => setIsOpen(false)}>
                                        Register
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}