import { getAllGearsAdmin } from "@/lib/actions/adminActions";
import { getAllCategories } from "@/lib/actions/publicActions";
import AdminGearsTable from "@/components/dashboard/AdminGearsTable";
import { TGear } from "@/app/types/gear";
import { TCategory } from "@/app/types/category";
import { Package, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAllGearsPage() {
    const [gearsRes, categoriesRes] = await Promise.all([
        getAllGearsAdmin(),
        getAllCategories(),
    ]);

    const gears: TGear[] = Array.isArray(gearsRes)
        ? gearsRes
        : gearsRes?.data || gearsRes?.result || [];

    const categories: TCategory[] = Array.isArray(categoriesRes)
        ? categoriesRes
        : categoriesRes?.data || categoriesRes?.result || [];

    return (
        <div className="space-y-8">
            {/* Top Banner Header */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Content Moderation • Admin Controls</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <Package className="h-7 w-7 text-teal-400" />
                        <span>All Gear Listings</span>
                    </h1>
                    <p className="text-sm text-slate-400 max-w-2xl">
                        Inspect, search, and moderate all gear equipment listings registered across the platform by providers.
                    </p>
                </div>
            </div>

            {/* Gears Moderation Table Component */}
            <AdminGearsTable initialGears={gears} categories={categories} />
        </div>
    );
}