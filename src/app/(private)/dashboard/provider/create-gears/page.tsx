"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { createGears } from "@/lib/actions/providerActions";
import { getAllCategories } from "@/lib/actions/publicActions";
import { TCategory } from "@/app/types/category";
import { TCreateGears } from "@/app/types/gear";
import { toast } from "sonner";
import {
    PackagePlus,
    Tag,
    DollarSign,
    Layers,
    Boxes,
    FileText,
    Loader2,
    Building2,
    Image as ImageIcon,
    Link as LinkIcon,
} from "lucide-react";

export default function CreateGearsPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<TCreateGears>();

    const watchImageUrl = watch("imageUrl");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                const catData = Array.isArray(res) ? res : res?.data || res?.result || [];
                setCategories(catData);
            } catch (err) {
                console.error("Failed to load categories:", err);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const onSubmit: SubmitHandler<TCreateGears> = async (data) => {
        setIsSubmitting(true);

        try {
            const photoUrl = data.imageUrl?.trim() || "";
            const defaultPhoto = "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop";
            const finalImage = photoUrl || defaultPhoto;

            const payload: TCreateGears = {
                name: data.name.trim(),
                brand: data.brand.trim(),
                price: Number(data.price) || 0,
                stock: Number(data.stock) || 1,
                categoryId: data.categoryId,
                description: data.description.trim(),
                photoUrl: finalImage,
            };

            const res = await createGears(payload);

            if (res?.success || res?.statusCode === 200 || res?.statusCode === 201 || res?.id || res?._id || res?.data) {
                toast.success(res?.message || "Gear listing created successfully!");
                reset();
                router.refresh();
            } else {
                toast.error(res?.message || "Failed to create gear listing.");
            }
        } catch (error) {
            console.error("Error creating gear:", error);
            toast.error("An unexpected error occurred while creating gear.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            <PackagePlus className="h-5 w-5" />
                        </div>
                        List New Gear
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Add equipment to your rental inventory for customers to browse and book.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-6 shadow-xl">

                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
                            <Tag className="h-4 w-4" />
                            General Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                    <PackagePlus className="h-3.5 w-3.5 text-teal-400" />
                                    Gear Title / Name <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sony Alpha A7 IV Camera"
                                    {...register("name", { required: "Gear name is required" })}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                                />
                                {errors.name && (
                                    <p className="text-xs text-rose-400 font-medium mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5 text-teal-400" />
                                    Brand / Manufacturer <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sony, Canon, DJI"
                                    {...register("brand", { required: "Brand is required" })}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                                />
                                {errors.brand && (
                                    <p className="text-xs text-rose-400 font-medium mt-1">{errors.brand.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                    <Layers className="h-3.5 w-3.5 text-teal-400" />
                                    Category <span className="text-rose-400">*</span>
                                </label>
                                {isLoadingCategories ? (
                                    <div className="flex items-center gap-2 px-4 py-3 text-xs text-slate-500 bg-slate-950/80 rounded-xl border border-slate-800">
                                        <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
                                        Loading categories...
                                    </div>
                                ) : (
                                    <select
                                        {...register("categoryId", { required: "Category selection is required" })}
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    >
                                        <option value="">Select a Category</option>
                                        {categories.map((cat: TCategory) => {
                                            const catId = cat._id || cat.id;
                                            return (
                                                <option key={catId} value={catId}>
                                                    {cat.name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                )}
                                {errors.categoryId && (
                                    <p className="text-xs text-rose-400 font-medium mt-1">{errors.categoryId.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
                            <ImageIcon className="h-4 w-4" />
                            Equipment Photo URL
                        </h2>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                    <LinkIcon className="h-3.5 w-3.5 text-teal-400" />
                                    Image Direct URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="e.g. https://images.unsplash.com/photo-1517649763962..."
                                    {...register("imageUrl")}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                                />
                                <p className="text-[11px] text-slate-500">
                                    Provide a public photo URL (Unsplash, ImgBB, Cloudinary, etc.) to showcase this gear.
                                </p>
                            </div>

                            {watchImageUrl && watchImageUrl.trim() !== "" && (
                                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">
                                    <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                        <ImageIcon className="h-3.5 w-3.5 text-teal-400" />
                                        Photo Preview:
                                    </p>
                                    <div className="relative h-48 w-full max-w-sm rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                                        <Image
                                            src={watchImageUrl.trim()}
                                            alt="Gear preview"
                                            className="h-full w-full object-cover"
                                            width={500}
                                            height={500}
                                            unoptimized
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop";
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
                            <DollarSign className="h-4 w-4" />
                            Pricing & Inventory
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                    <DollarSign className="h-3.5 w-3.5 text-teal-400" />
                                    Daily Rental Rate ($) <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="e.g. 45.00"
                                    {...register("price", {
                                        required: "Price is required",
                                        valueAsNumber: true,
                                    })}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                                />
                                {errors.price && (
                                    <p className="text-xs text-rose-400 font-medium mt-1">{errors.price.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                    <Boxes className="h-3.5 w-3.5 text-teal-400" />
                                    Stock Quantity <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 3"
                                    {...register("stock", {
                                        required: "Stock quantity is required",
                                        valueAsNumber: true,
                                    })}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                                />
                                {errors.stock && (
                                    <p className="text-xs text-rose-400 font-medium mt-1">{errors.stock.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
                            <FileText className="h-4 w-4" />
                            Details & Description
                        </h2>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 text-teal-400" />
                                Gear Description <span className="text-rose-400">*</span>
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Describe the specifications, included accessories, and condition of this gear..."
                                {...register("description", { required: "Description is required" })}
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
                            />
                            {errors.description && (
                                <p className="text-xs text-rose-400 font-medium mt-1">{errors.description.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-xl border border-slate-800 bg-slate-800/80 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Submitting Gear...</span>
                                </>
                            ) : (
                                <>
                                    <PackagePlus className="h-4 w-4 stroke-[2.5]" />
                                    <span>Save & Publish Gear</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}