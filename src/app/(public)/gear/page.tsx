"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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
    ShieldAlert,
} from "lucide-react";

type SortOption = "default" | "price-asc" | "price-desc" | "name";

const DEFAULT_GEAR_IMAGE =
    "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop";

export default function BrowseGearPage() {
    const [gears, setGears] = useState<TGear[]>([]);
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

                const gearList: TGear[] = Array.isArray(gearsRes)
                    ? gearsRes
                    : gearsRes?.data || gearsRes?.result || [];
                setGears(gearList);

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

    const availableBrands = useMemo(() => {
        const brands = gears
            .map((g) => g.brand)
            .filter((b): b is string => Boolean(b && b.trim()));
        return Array.from(new Set(brands)).sort();
    }, [gears]);

    const getCategoryName = (gear: TGear): string => {
        if (gear.category?.name) return gear.category.name;
        if (typeof gear.categoryId === "object" && gear.categoryId?.name) {
            return gear.categoryId.name;
        }
        const catId =
            typeof gear.categoryId === "string"
                ? gear.categoryId
                : gear.categoryId?.id || gear.categoryId?._id;
        if (catId) {
            const found = categories.find(
                (c) => c.id === catId || c._id === catId
            );
            if (found) return found.name;
        }
        return "General";
    };

    const getGearImage = (gear: TGear): string => {
        if (gear.imageUrl && gear.imageUrl.trim() !== "") return gear.imageUrl;
        if (gear.images && gear.images.length > 0 && gear.images[0].trim() !== "")
            return gear.images[0];
        return DEFAULT_GEAR_IMAGE;
    };

    const filteredGears = useMemo(() => {
        return gears
            .filter((gear) => {
                const matchesSearch =
                    searchTerm.trim() === "" ||
                    gear.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    gear.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    gear.description.toLowerCase().includes(searchTerm.toLowerCase());

                const gearCatId =
                    typeof gear.categoryId === "object"
                        ? gear.categoryId?.id || gear.categoryId?._id
                        : gear.categoryId || gear.category?.id || gear.category?._id;

                const matchesCategory =
                    selectedCategory === "" || gearCatId === selectedCategory;

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
        searchTerm !== "" ||
        selectedCategory !== "" ||
        selectedBrand !== "" ||
        sortBy !== "default";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/80 p-6 sm:p-10 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
                    <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>GearUp Rental Inventory</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                            Explore & Rent{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                Premium Equipment
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                            Browse high-performance sports and outdoor equipment available
                            for rent. Filter by category, brand, or search by keyword to
                            find gear for your next adventure.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 backdrop-blur-md space-y-4 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, brand, spec..."
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                        </div>

                        <div className="relative w-full md:w-48">
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

                        <div className="relative w-full md:w-48">
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

                        <div className="relative w-full md:w-44">
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
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 pt-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <span>
                            Showing <strong className="text-white">{filteredGears.length}</strong> equipment items
                        </span>
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

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                            <div
                                key={idx}
                                className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4"
                            >
                                <div className="h-44 w-full bg-slate-800/60 rounded-xl" />
                                <div className="h-4 bg-slate-800/80 rounded w-3/4" />
                                <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                                <div className="h-8 bg-slate-800/60 rounded-xl w-full" />
                            </div>
                        ))}
                    </div>
                ) : filteredGears.length === 0 ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center flex flex-col items-center justify-center space-y-4 my-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500 border border-slate-700">
                            <Boxes className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-200">
                                No Equipment Found
                            </h3>
                            <p className="text-sm text-slate-400 max-w-md mx-auto">
                                No gear matches your current search or filter criteria. Try
                                clearing filters or using a different keyword.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {filteredGears.map((gear) => {
                            const gearId = gear._id || gear.id || "";
                            const isAvailable =
                                gear.stock > 0 && gear.isAvailable !== false;
                            const categoryName = getCategoryName(gear);
                            const gearImg = getGearImage(gear);

                            return (
                                <div
                                    key={gearId}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden hover:border-teal-500/40 hover:bg-slate-900/90 transition-all duration-300 shadow-lg hover:shadow-teal-500/10"
                                >
                                    <div className="relative w-full h-48 bg-slate-950 overflow-hidden">
                                        <Image
                                            src={gearImg}
                                            alt={gear.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            unoptimized={gearImg.startsWith("http")}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                                        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-300 shadow-md">
                                            <Tag className="h-3 w-3 text-teal-400" />
                                            <span className="truncate max-w-[110px]">
                                                {categoryName}
                                            </span>
                                        </div>

                                        <div className="absolute top-3 right-3">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md border shadow-md ${isAvailable
                                                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                                                        : "bg-rose-950/80 text-rose-400 border-rose-500/30"
                                                    }`}
                                            >
                                                {isAvailable ? (
                                                    <PackageCheck className="h-3 w-3" />
                                                ) : (
                                                    <ShieldAlert className="h-3 w-3" />
                                                )}
                                                <span>
                                                    {isAvailable
                                                        ? `${gear.stock} Available`
                                                        : "Out of Stock"}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                                        <div className="space-y-1.5">
                                            {gear.brand && (
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400/90 block">
                                                    {gear.brand}
                                                </span>
                                            )}
                                            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                                                {gear.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                                {gear.description ||
                                                    "High performance equipment for outdoor and sports rentals."}
                                            </p>
                                        </div>

                                        <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                                            <div>
                                                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                                                    Daily Rate
                                                </span>
                                                <div className="flex items-baseline gap-0.5">
                                                    <span className="text-lg font-extrabold text-white">
                                                        ${gear.price}
                                                    </span>
                                                    <span className="text-xs text-slate-400">/day</span>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/gear/${gearId}`}
                                                className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400 transition-all active:scale-[0.98]"
                                            >
                                                <span>Details</span>
                                                <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                                            </Link>
                                        </div>
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
