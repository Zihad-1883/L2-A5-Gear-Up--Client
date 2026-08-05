import Link from "next/link";
import { notFound } from "next/navigation";
import { getSingleGear } from "@/lib/actions/publicActions";
import { TGear } from "@/app/types/gear";
import {
    ArrowLeft,
    Building2,
    Boxes,
    ShieldCheck,
    PackageCheck,
    Sparkles,
    CheckCircle2,
    Info,
} from "lucide-react";

interface GearDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function GearDetailPage({ params }: GearDetailPageProps) {
    const { id } = await params;
    const res = await getSingleGear(id);

    const gear: TGear | null = res?.data || res?.result || res || null;

    if (!gear || !gear.name) {
        notFound();
    }

    const isAvailable = gear.stock > 0 && gear.isAvailable !== false;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Navigation Back Link */}
                <div>
                    <Link
                        href="/gear"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-teal-400 transition-colors bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to All Gear</span>
                    </Link>
                </div>

                {/* Main Card Section */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-xl space-y-8 shadow-2xl">
                    {/* Header Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                                <div className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
                                    <Building2 className="h-3.5 w-3.5" />
                                    <span>{gear.brand || "Brand"}</span>
                                </div>

                                <div
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                                        isAvailable
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    }`}
                                >
                                    <PackageCheck className="h-3.5 w-3.5" />
                                    <span>{isAvailable ? `${gear.stock} Available` : "Out of Stock"}</span>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                                {gear.name}
                            </h1>
                        </div>

                        {/* Price Badge */}
                        <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-4 text-right">
                            <span className="text-xs uppercase font-bold text-teal-400 block tracking-wider">Rental Price</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white">${gear.price}</span>
                                <span className="text-xs text-slate-400">/ day</span>
                            </div>
                        </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Building2 className="h-4 w-4 text-teal-400" />
                                <span>Manufacturer</span>
                            </div>
                            <p className="text-sm font-bold text-slate-100">{gear.brand}</p>
                        </div>

                        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Boxes className="h-4 w-4 text-teal-400" />
                                <span>Inventory Stock</span>
                            </div>
                            <p className="text-sm font-bold text-slate-100">{gear.stock} units in stock</p>
                        </div>

                        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <ShieldCheck className="h-4 w-4 text-teal-400" />
                                <span>Inspection</span>
                            </div>
                            <p className="text-sm font-bold text-emerald-400">Verified & Maintained</p>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-3 pt-2">
                        <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                            <Info className="h-4 w-4" />
                            Gear Description & Specifications
                        </h2>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                            {gear.description || "No description provided for this equipment."}
                        </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>Instant booking with flexible daily rental rates.</span>
                        </div>

                        <Link
                            href={`/dashboard/customer/orders?gearId=${gear._id || gear.id}`}
                            className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-lg transition-all active:scale-[0.98] ${
                                isAvailable
                                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400"
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none"
                            }`}
                        >
                            <Sparkles className="h-4 w-4" />
                            <span>{isAvailable ? "Proceed to Rent Gear" : "Currently Unavailable"}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
