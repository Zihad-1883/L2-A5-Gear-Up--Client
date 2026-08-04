"use client";

import { PackageSearch, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeaturedGears() {

    return (
        <section className="bg-slate-900/40 py-24 border-y border-slate-800/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Handpicked Rentals</span>
                        </div>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Featured Gear Collection
                        </h2>
                    </div>

                </div>

                <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-20 text-center backdrop-blur-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-inner">
                        <PackageSearch className="h-8 w-8" />
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-white">
                        Featured Gear Catalog Coming Soon
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-slate-400 leading-relaxed">
                        We are currently updating our verified inventory with top-rated kayaks, mountain bikes, tent kits, and snowboards. Check back shortly or browse all items.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                        <Button asChild variant="outline" size="sm" className="border-slate-800 text-slate-300 hover:border-slate-700">
                            <Link href="/gear" className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-teal-400" />
                                Browse Full Catalog
                            </Link>
                        </Button>
                    </div>
                </div>

            </div>
        </section>
    );
}
