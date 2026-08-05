"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getAllGears, getAllCategories } from "@/lib/actions/publicActions";
import { TGear } from "@/app/types/gear";
import { TCategory } from "@/app/types/category";
import {
    Search,
    Layers,
    Building2,
    Boxes,
    ArrowUpDown,
    Sparkles,
    ChevronRight,
    RotateCcw,
    PackageCheck,
    Tag,
} from "lucide-react";

type SortOption = "default" | "price-asc" | "price-desc" | "name";

export default function BrowseGearPage() {
    const [gears, setGears] = useState<TGear[]>([]);
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("default");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [gearsRes, catRes] = await Promise.all([
                    getAllGears(),
                    getAllCategories(),
                ]);

                // Extract gear data array
                const gearList: TGear[] = Array.isArray(gearsRes)
                    ? gearsRes
                    : gearsRes?.data || gearsRes?.result || [];
                setGears(gearList);

                // Extract category data array
                const catList: TCategory[] = Array.isArray(catRes)
                    ? catRes
                    : catRes?.data || catRes?.result || [];
                setCategories(catList);
            } catch (error) {
                console.error("Failed to load browse gear data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Unique Brands list for dropdown filter
    const availableBrands = useMemo(() => {
        const brands = gears
            .map((g) => g.brand)
            .filter((b): b is string => Boolean(b && b.trim()));
        return Array.from(new Set(brands)).sort();
    }, [gears]);

    // Filtered & Sorted gear items
    const filteredGears = useMemo(() => {
        return gears
            .filter((gear) => {
                // Search term matching
                const matchesSearch =
                    searchTerm.trim() === "" ||
                    gear.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    gear.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    gear.description.toLowerCase().includes(searchTerm.toLowerCase());

                // Category matching
                const gearCatId =
                    typeof gear.categoryId === "object"
                        ? gear.categoryId?.id || gear.categoryId?._id
                        : gear.categoryId || gear.category?.id || gear.category?._id;

                const matchesCategory =
                    selectedCategory === "" || gearCatId === selectedCategory;

                // Brand matching
                const matchesBrand =
                    selectedBrand === "" ||
                    gear.brand.toLowerCase() === selectedBrand.toLowerCase();

                return matchesSearch && matchesCategory && matchesBrand;
            })
            .sort((a, b) => {
                if (sortBy === "price-asc") return a.price - b.price;
                if (sortBy === "price-desc") return b.price - a.price;
                if (sortBy === "name") return a.name.localeCompare(b.name);
                return 0;
            });
    }, [gears, searchTerm, selectedCategory, selectedBrand, sortBy]);

    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setSelectedBrand("");
        setSortBy("default");
    };

    const hasActiveFilters =
        searchTerm !== "" || selectedCategory !== "" || selectedBrand !== "" || sortBy !== "default";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero / Header Section */}
                <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/80 p-6 sm:p-10 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
                    <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>GearUp Rental Inventory</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                            Explore & Rent <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Premium Equipment</span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                            Browse high-performance sports and outdoor equipment available for rent. Filter by category, brand, or search by keyword to find gear for your next adventure.
                        </p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 backdrop-blur-md space-y-4 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
                        {/* Search Input */}
                        <div className="md:col-span-4 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, brand, spec..."
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="md:col-span-3 relative">
                            <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400 pointer-events-none" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-8 py-2.5 text-sm text-slate-100 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => {
                                    const catId = cat.id || cat._id || cat.name;
                                    return (
                                        <option key={catId} value={catId}>
                                            {cat.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Brand Dropdown */}
                        <div className="md:col-span-3 relative">
                            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400 pointer-events-none" />
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-8 py-2.5 text-sm text-slate-100 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                            >
                                <option value="">All Brands</option>
                                {availableBrands.map((brand) => (
                                    <option key={brand} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="md:col-span-2 relative">
                            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-8 py-2.5 text-sm text-slate-100 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                            >
                                <option value="default">Sort By</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                            <span>Showing <strong className="text-white">{filteredGears.length}</strong> equipment items</span>
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={handleResetFilters}
                                className="inline-flex items-center gap-1.5 font-medium text-teal-400 hover:text-teal-300 transition-colors bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-lg"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Gear Items Grid / State Render */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <div
                                key={idx}
                                className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4"
                            >
                                <div className="h-44 w-full bg-slate-800/60 rounded-xl" />
                                <div className="h-4 bg-slate-800/80 rounded w-3/4" />
                                <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                                <div className="h-8 bg-slate-800/60 rounded-xl w-full" />
                            </div>
                        ))}
                    </div>
                ) : filteredGears.length === 0 ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500 border border-slate-700">
                            <Boxes className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-200">No Equipment Found</h3>
                            <p className="text-sm text-slate-400 max-w-md mx-auto">
                                No gear matches your current search or filter criteria. Try clearing filters or using a different keyword.
                            </p>
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={handleResetFilters}
                                className="inline-flex items-center gap-2 rounded-xl bg-teal-500/10 border border-teal-500/30 px-4 py-2.5 text-xs font-semibold text-teal-300 hover:bg-teal-500/20 transition-all"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Clear All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGears.map((gear) => {
                            const gearId = gear._id || gear.id || "";
                            const isAvailable = gear.stock > 0 && (gear.isAvailable !== false);

                            return (
                                <div
                                    key={gearId}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden hover:border-teal-500/40 hover:bg-slate-900/90 transition-all shadow-lg hover:shadow-teal-500/10"
                                >
                                    {/* Header Badge Strip */}
                                    <div className="p-5 pb-3 flex items-center justify-between gap-2">
                                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[11px] font-semibold text-teal-400">
                                            <Tag className="h-3 w-3" />
                                            <span>{gear.brand || "Brand"}</span>
                                        </div>

                                        <div
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                                                isAvailable
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                            }`}
                                        >
                                            <PackageCheck className="h-3 w-3" />
                                            <span>{isAvailable ? `${gear.stock} In Stock` : "Unavailable"}</span>
                                        </div>
                                    </div>

                                    {/* Item Details */}
                                    <div className="px-5 space-y-2.5 flex-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                                            {gear.name}
                                        </h3>

                                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                                            {gear.description || "High performance equipment for outdoor and sports rentals."}
                                        </p>
                                    </div>

                                    {/* Footer / Price & CTA */}
                                    <div className="p-5 pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                                        <div>
                                            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Daily Rate</span>
                                            <div className="flex items-baseline gap-0.5">
                                                <span className="text-xl font-extrabold text-white">${gear.price}</span>
                                                <span className="text-xs text-slate-400">/day</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/gear/${gearId}`}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400 transition-all active:scale-[0.98]"
                                        >
                                            <span>View Details</span>
                                            <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
