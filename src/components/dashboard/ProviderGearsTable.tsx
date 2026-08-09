"use client";

import { useState } from "react";
import Link from "next/link";
import { TGear } from "@/app/types/gear";
import { TCategory } from "@/app/types/category";
import EditGearModal from "@/components/dashboard/EditGearModal";
import DeleteGearModal from "@/components/dashboard/DeleteGearModal";
import {
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    Package,
    Plus,
    Search,
    Building2,
    BoxesIcon,
    Layers,
    CheckCircle2,
    XCircle,
} from "lucide-react";

interface ProviderGearsTableProps {
    initialGears: TGear[];
    categories: TCategory[];
}

export default function ProviderGearsTable({
    initialGears,
    categories,
}: ProviderGearsTableProps) {
    const [gears, setGears] = useState<TGear[]>(initialGears);
    const [searchQuery, setSearchQuery] = useState("");

    const [activeDropdown, setActiveDropdown] = useState<{
        gearId: string;
        top: number;
        right: number;
    } | null>(null);

    const [selectedGearForEdit, setSelectedGearForEdit] = useState<TGear | null>(null);
    const [selectedGearForDelete, setSelectedGearForDelete] = useState<TGear | null>(null);

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

    const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, gearId: string) => {
        e.stopPropagation();
        if (activeDropdown?.gearId === gearId) {
            setActiveDropdown(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setActiveDropdown({
                gearId,
                top: rect.bottom + 4,
                right: Math.max(16, window.innerWidth - rect.right),
            });
        }
    };

    const handleEditSuccess = (updatedGear: TGear) => {
        const targetId = updatedGear._id || updatedGear.id;
        setGears((prev) =>
            prev.map((g) => ((g._id || g.id) === targetId ? updatedGear : g))
        );
    };

    const handleDeleteSuccess = (deletedGearId: string) => {
        setGears((prev) => prev.filter((g) => (g._id || g.id) !== deletedGearId));
    };

    const filteredGears = gears.filter((gear) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        const nameMatch = gear.name?.toLowerCase().includes(query);
        const brandMatch = gear.brand?.toLowerCase().includes(query);
        const categoryMatch = getCategoryName(gear).toLowerCase().includes(query);
        return nameMatch || brandMatch || categoryMatch;
    });

    const totalStock = gears.reduce((sum, g) => sum + (Number(g.stock) || 0), 0);
    const activeListings = gears.filter((g) => (Number(g.stock) || 0) > 0).length;

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <Package className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Total Items</p>
                        <p className="text-xl font-extrabold text-white">{gears.length}</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <BoxesIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Total Available Stock</p>
                        <p className="text-xl font-extrabold text-white">{totalStock} Units</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Active Listings</p>
                        <p className="text-xl font-extrabold text-white">{activeListings}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search gear by name, brand, or category..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                </div>

                <Link
                    href="/dashboard/provider/create-gears"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400 transition-all active:scale-[0.98]"
                >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>List New Gear</span>
                </Link>
            </div>

            {gears.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center flex flex-col items-center justify-center space-y-4 backdrop-blur-xl shadow-2xl">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <Package className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No Equipment Listed Yet</h3>
                    <p className="text-sm text-slate-400 max-w-md">
                        You haven&apos;t added any gear to your inventory yet. Start listing your equipment to rent it out to customer clients!
                    </p>
                    <Link
                        href="/dashboard/provider/create-gears"
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-500/10 border border-teal-500/30 px-5 py-2.5 text-sm font-semibold text-teal-300 hover:bg-teal-500/20 transition-all mt-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add First Gear Item</span>
                    </Link>
                </div>
            ) : filteredGears.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center flex flex-col items-center justify-center space-y-2 backdrop-blur-md">
                    <Search className="h-8 w-8 text-slate-600 mb-1" />
                    <h4 className="text-base font-bold text-slate-300">No matching gear found</h4>
                    <p className="text-xs text-slate-500">
                        No equipment matched your search term &quot;{searchQuery}&quot;. Try another term.
                    </p>
                </div>
            ) : (

                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-xl shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950/80 text-xs uppercase font-bold text-teal-400 tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="py-4 px-6">Gear Details</th>
                                    <th className="py-4 px-6">Category</th>
                                    <th className="py-4 px-6">Daily Rate</th>
                                    <th className="py-4 px-6">Stock Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80">
                                {filteredGears.map((gear, idx) => {
                                    const gearId = gear._id || gear.id || `gear-${idx}`;
                                    const categoryName = getCategoryName(gear);
                                    const gearPrice = Number(gear.price) || 0;
                                    const gearStock = Number(gear.stock) || 0;

                                    return (
                                        <tr
                                            key={gearId}
                                            className="hover:bg-slate-800/40 transition-colors group"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-teal-400 font-bold text-sm">
                                                        {gear.name ? gear.name.charAt(0).toUpperCase() : <Package className="h-5 w-5" />}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/gear/${gearId}`}
                                                            className="font-bold text-white text-base hover:text-teal-300 transition-colors"
                                                        >
                                                            {gear.name}
                                                        </Link>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                                                            <Building2 className="h-3 w-3 text-slate-500" />
                                                            <span>{gear.brand}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                                                    <Layers className="h-3 w-3" />
                                                    {categoryName}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="font-extrabold text-white text-base flex items-center">
                                                    <span>${gearPrice.toFixed(2)}</span>
                                                    <span className="text-xs text-slate-400 font-normal ml-1">/ day</span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                {gearStock > 0 ? (
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
                                                <button
                                                    onClick={(e) => handleDropdownClick(e, gearId)}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
                                                    aria-label="Options menu"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setActiveDropdown(null)}
                    />
                    <div
                        style={{
                            top: `${activeDropdown.top}px`,
                            right: `${activeDropdown.right}px`,
                        }}
                        className="fixed z-50 w-44 rounded-2xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
                    >
                        <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Gear Actions
                        </p>
                        {(() => {
                            const currentGear = gears.find(
                                (g) => (g._id || g.id) === activeDropdown.gearId
                            );
                            if (!currentGear) return null;
                            const currentId = currentGear._id || currentGear.id;

                            return (
                                <>
                                    <Link
                                        href={`/gear/${currentId}`}
                                        onClick={() => setActiveDropdown(null)}
                                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                                    >
                                        <Eye className="h-4 w-4 text-teal-400" />
                                        <span>See Details</span>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            setActiveDropdown(null);
                                            setSelectedGearForEdit(currentGear);
                                        }}
                                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-300 transition-colors"
                                    >
                                        <Pencil className="h-4 w-4 text-amber-400" />
                                        <span>Edit Gear</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setActiveDropdown(null);
                                            setSelectedGearForDelete(currentGear);
                                        }}
                                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete</span>
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </>
            )}

            <EditGearModal
                key={selectedGearForEdit?._id || selectedGearForEdit?.id || "edit-modal"}
                gear={selectedGearForEdit}
                categories={categories}
                isOpen={!!selectedGearForEdit}
                onClose={() => setSelectedGearForEdit(null)}
                onSuccess={handleEditSuccess}
            />

            <DeleteGearModal
                gear={selectedGearForDelete}
                isOpen={!!selectedGearForDelete}
                onClose={() => setSelectedGearForDelete(null)}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}
