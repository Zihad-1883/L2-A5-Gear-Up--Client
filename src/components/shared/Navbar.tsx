"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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
                    <Link
                        href="/gear"
                        className="text-sm font-medium text-slate-300 transition-colors hover:text-teal-400"
                    >
                        Browse Gears
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-slate-300 transition-colors hover:text-teal-400"
                    >
                        About Us
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-medium text-slate-300 transition-colors hover:text-teal-400"
                    >
                        Contact
                    </Link>
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild variant="default" size="sm">
                        <Link href="/register">Register</Link>
                    </Button>
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
                        <Link
                            href="/gear"
                            onClick={() => setIsOpen(false)}
                            className="text-sm font-medium text-slate-300 hover:text-teal-400"
                        >
                            Browse Gears
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className="text-sm font-medium text-slate-300 hover:text-teal-400"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setIsOpen(false)}
                            className="text-sm font-medium text-slate-300 hover:text-teal-400"
                        >
                            Contact
                        </Link>

                        <div className="pt-2 flex flex-col gap-2">
                            <Button asChild variant="outline" size="sm" className="w-full">
                                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                                    Login
                                </Link>
                            </Button>
                            <Button asChild variant="default" size="sm" className="w-full">
                                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                                    Register
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}