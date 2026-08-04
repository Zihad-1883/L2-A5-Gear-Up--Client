"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Compass, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroBanner() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-32">
            {/* Background Glow Highlights */}
            <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute top-1/2 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">

                    {/* Announcement Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-300 backdrop-blur-md transition-all hover:border-teal-500/50">
                        <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                        <span>The Ultimate Sports & Gear Rental Platform</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                        Rent Top-Tier Gear <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                            For Every Adventure
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg lg:text-xl">
                        Access premium outdoor equipment, kayaks, mountain bikes, and camping gear without the steep price tag. Or host your equipment and earn extra income.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button asChild size="lg" className="w-full sm:w-auto text-base font-semibold px-8 shadow-lg shadow-teal-500/25">
                            <Link href="/gear" className="flex items-center gap-2">
                                Explore Gear Catalog
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base border-slate-700 text-slate-200 hover:border-slate-600 hover:bg-slate-800/60">
                            <Link href="/register?role=PROVIDER" className="flex items-center gap-2">
                                <Compass className="h-5 w-5 text-teal-400" />
                                Host Your Gear
                            </Link>
                        </Button>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="mt-16 grid grid-cols-2 gap-6 border-t border-slate-800/80 pt-10 sm:grid-cols-4 sm:gap-12 lg:max-w-4xl">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-2xl font-extrabold text-white sm:text-3xl">
                                5,000+
                            </div>
                            <div className="mt-1 text-xs font-medium text-slate-400">Verified Equipment</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-2xl font-extrabold text-teal-400 sm:text-3xl">
                                <ShieldCheck className="h-6 w-6 text-teal-400 inline" /> 100%
                            </div>
                            <div className="mt-1 text-xs font-medium text-slate-400">Insured Rentals</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-2xl font-extrabold text-white sm:text-3xl">
                                <Users className="h-6 w-6 text-cyan-400 inline" /> 12k+
                            </div>
                            <div className="mt-1 text-xs font-medium text-slate-400">Active Adventurers</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-2xl font-extrabold text-amber-400 sm:text-3xl">
                                4.9 <Star className="h-5 w-5 fill-amber-400 text-amber-400 inline" />
                            </div>
                            <div className="mt-1 text-xs font-medium text-slate-400">User Rating</div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
