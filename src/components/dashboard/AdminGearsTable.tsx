"use client";

import { useState } from "react";
import Link from "next/link";
import { TGear } from "@/app/types/gear";
import { TCategory } from "@/app/types/category";
import { deleteGearAdmin } from "@/lib/actions/adminActions";
import { toast } from "sonner";
import {
    Package,
    Search,
    Building2,
    Boxes,
    Layers,
    CheckCircle2,
    XCircle,
    Eye,
    Trash2,
    ShieldAlert,
    AlertTriangle,
    Loader2,
    DollarSign,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface AdminGearsTableProps {
    initialGears: TGear[];
    categories: TCategory[];
}

export default function AdminGearsTable({
    initialGears,
    categories,
}: AdminGearsTableProps) {
    const [gears, setGears] = useState<TGear[]>(initialGears);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [gearToDelete, setGearToDelete] = useState<TGear | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const getCategoryId = (gear: TGear): string => {
        if (typeof gear.categoryId === "string") return gear.categoryId;
        if (typeof gear.categoryId === "object" && gear.categoryId) {
            return gear.categoryId._id || gear.categoryId.id || "";
        }
        if (gear.category) {
            return gear.category._id || gear.category.id || "";
        }
        return "";
    };

    const getCategoryName = (gear: TGear): string => {
        if (typeof gear.category === "object" && gear.category?.name) return gear.category.name;
        if (typeof gear.categoryId === "object" && gear.categoryId?.name) return gear.categoryId.name;
        const catId = getCategoryId(gear);
        const found = categories.find((c) => (c.id || c._id) === catId);
        return found?.name || "General";
    };

    const getGearImage = (gear: TGear): string => {
        if (gear.imageUrl && gear.imageUrl.trim() !== "") return gear.imageUrl;
        if (gear.photoUrl && gear.photoUrl.trim() !== "") return gear.photoUrl;
        if (gear.photo && gear.photo.trim() !== "") return gear.photo;
        if (gear.image && gear.image.trim() !== "") return gear.image;
        if (gear.images && gear.images.length > 0 && gear.images[0]?.trim() !== "")
            return gear.images[0];
        return "";
    };

    const handleDeleteGear = async () => {
        if (!gearToDelete) return;
        const targetId = gearToDelete._id || gearToDelete.id;
        if (!targetId) return;

        setIsDeleting(true);
        try {
            const res = await deleteGearAdmin(targetId);
            if (res?.success || res?.statusCode === 200) {
                toast.success(res?.message || "Gear listing removed by Admin moderation.");
                setGears((prev) => prev.filter((g) => (g._id || g.id) !== targetId));
                setGearToDelete(null);
            } else {
                toast.error(res?.message || "Failed to delete gear listing.");
            }
        } catch (err) {
            console.error("Admin delete gear error:", err);
            toast.error("An error occurred while removing gear listing.");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredGears = gears.filter((gear) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
            !query ||
            gear.name?.toLowerCase().includes(query) ||
            gear.brand?.toLowerCase().includes(query) ||
            gear.description?.toLowerCase().includes(query) ||
            getCategoryName(gear).toLowerCase().includes(query);

        const gearCatId = getCategoryId(gear);
        const matchesCategory =
            !selectedCategory || gearCatId === selectedCategory;

        return matchesQuery && matchesCategory;
    });

    const totalListings = gears.length;
    const totalStock = gears.reduce((sum, g) => sum + (Number(g.stock) || 0), 0);
    const availableListings = gears.filter((g) => (Number(g.stock) || 0) > 0).length;

    return (
        <div className="space-y-6">

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <Package className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Total Listings</p>
                        <p className="text-xl font-extrabold text-white">{totalListings} Items</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Boxes className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Total In-Stock Units</p>
                        <p className="text-xl font-extrabold text-white">{totalStock} Units</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Active Available Gear</p>
                        <p className="text-xl font-extrabold text-white">{availableListings} Active</p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by gear name, brand, category..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                </div>

                <div className="w-full sm:w-56">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-100 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => {
                            const cId = cat.id || cat._id;
                            return (
                                <option key={cId} value={cId}>
                                    {cat.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Gears Moderation Table */}
            {gears.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center flex flex-col items-center justify-center space-y-4 backdrop-blur-xl shadow-2xl">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <Package className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No Gear Listings Found</h3>
                    <p className="text-sm text-slate-400 max-w-md">
                        There are currently no gear listings registered in the platform inventory.
                    </p>
                </div>
            ) : filteredGears.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center flex flex-col items-center justify-center space-y-2 backdrop-blur-md">
                    <Search className="h-8 w-8 text-slate-600 mb-1" />
                    <h4 className="text-base font-bold text-slate-300">No matching gear found</h4>
                    <p className="text-xs text-slate-500">
                        No equipment matched your filter criteria. Try adjusting your search.
                    </p>
                </div>
            ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-xl shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950/80 text-xs uppercase font-bold text-teal-400 tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="py-4 px-6">Equipment Listing</th>
                                    <th className="py-4 px-6">Category</th>
                                    <th className="py-4 px-6">Daily Rate</th>
                                    <th className="py-4 px-6">Stock Status</th>
                                    <th className="py-4 px-6 text-right">Moderation Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80">
                                {filteredGears.map((gear, idx) => {
                                    const gearId = gear._id || gear.id || `gear-${idx}`;
                                    const categoryName = getCategoryName(gear);
                                    const gearImg = getGearImage(gear);
                                    const gearPrice = Number(gear.price) || 0;
                                    const gearStock = Number(gear.stock) || 0;
                                    const isAvailable = gearStock > 0 && gear.isAvailable !== false;

                                    return (
                                        <tr
                                            key={gearId}
                                            className="hover:bg-slate-800/40 transition-colors group"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                                                        {gearImg ? (
                                                            /* eslint-disable-next-line @next/next/no-img-element */
                                                            <img
                                                                src={gearImg}
                                                                alt={gear.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <Package className="h-5 w-5 text-slate-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/gear/${gearId}`}
                                                            className="font-bold text-white text-base hover:text-teal-300 transition-colors line-clamp-1"
                                                        >
                                                            {gear.name}
                                                        </Link>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                                                            <Building2 className="h-3 w-3 text-teal-400" />
                                                            <span>{gear.brand}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                                                    <Layers className="h-3 w-3" />
                                                    {categoryName}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="font-extrabold text-white text-base flex items-center">
                                                    <DollarSign className="h-4 w-4 text-teal-400 -mr-0.5" />
                                                    <span>{gearPrice.toFixed(2)}</span>
                                                    <span className="text-xs text-slate-400 font-normal ml-1">/ day</span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                {isAvailable ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        In Stock ({gearStock})
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/gear/${gearId}`}
                                                        className="inline-flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 text-teal-400" />
                                                        <span>Inspect</span>
                                                    </Link>

                                                    <button
                                                        onClick={() => setGearToDelete(gear)}
                                                        className="inline-flex items-center gap-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-400 border border-rose-500/30 transition-colors"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Moderation Delete Confirmation Modal */}
            <Dialog open={!!gearToDelete} onOpenChange={(open) => !open && setGearToDelete(null)}>
                <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl rounded-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-white">Moderate & Delete Gear</DialogTitle>
                                <DialogDescription className="text-xs text-slate-400">
                                    Admin Moderation Action
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-3 py-3">
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Are you sure you want to delete <strong className="text-white">&quot;{gearToDelete?.name}&quot;</strong> from the platform?
                            This action will permanently remove the listing from customer browsing.
                        </p>
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setGearToDelete(null)}
                            disabled={isDeleting}
                            className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteGear}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Removing...</span>
                                </>
                            ) : (
                                <>
                                    <ShieldAlert className="h-4 w-4" />
                                    <span>Confirm Delete</span>
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
