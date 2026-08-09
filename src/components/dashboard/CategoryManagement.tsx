"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TCategory } from "@/app/types/category";
import { createCategory } from "@/lib/actions/adminActions";
import { toast } from "sonner";
import {
    Plus,
    FolderPlus,
    Tags,
    AlignLeft,
    Sparkles,
    Loader2,
    Calendar,
    Layers,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface CategoryManagementProps {
    initialCategories: TCategory[];
}

export default function CategoryManagement({ initialCategories }: CategoryManagementProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<TCategory[]>(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFillSample = () => {
        setFormData({
            name: "Camping Gear",
            description: "Tents, sleeping bags, cooking sets, and all outdoor camping essentials",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Category name is required!");
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Category description is required!");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await createCategory({
                name: formData.name.trim(),
                description: formData.description.trim(),
            });

            console.log("Create category response:", res);

            if (res?.success || res?._id || res?.id || res?.data) {
                toast.success(res?.message || `Category "${formData.name.trim()}" created successfully!`);

                const newCategoryItem: TCategory = {
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                };

                setCategories((prev) => [newCategoryItem, ...prev]);
                setFormData({ name: "", description: "" });
                setIsModalOpen(false);
                router.refresh();
            } else {
                toast.error(res?.message || "Failed to create category. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting category:", error);
            toast.error("An unexpected error occurred while creating category.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 backdrop-blur-md inline-flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <FolderPlus className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Total Categories</p>
                        <p className="text-lg font-extrabold text-white">{categories.length}</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400 transition-all active:scale-[0.98]"
                >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Create Category</span>
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg border-slate-800 bg-slate-900 text-slate-100 shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                <FolderPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-white">Create New Category</DialogTitle>
                                <DialogDescription className="text-xs text-slate-400">
                                    Add a new gear category to organize platform equipment.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleFillSample}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-lg"
                            >
                                <Sparkles className="h-3 w-3" />
                                Auto-fill Demo Data
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                <Tags className="h-3.5 w-3.5 text-teal-400" />
                                Category Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Camping Gear"
                                required
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                <AlignLeft className="h-3.5 w-3.5 text-teal-400" />
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="e.g. Tents, sleeping bags, cooking sets, and all outdoor camping essentials"
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
                            />
                        </div>

                        <DialogFooter className="pt-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isSubmitting}
                                className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 stroke-[2.5]" />
                                        <span>Save Category</span>
                                    </>
                                )}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-teal-400" />
                    All Categories ({categories.length})
                </h2>

                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 text-slate-500 mb-3">
                            <FolderPlus className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-300">No Categories Created Yet</h3>
                        <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">
                            No categories have been created yet. Click the button below to add your first category.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-teal-500/10 border border-teal-500/30 px-4 py-2 text-xs font-semibold text-teal-300 hover:bg-teal-500/20 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Create First Category</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category, index) => {
                            const catItem = category as TCategory & { _id?: string; id?: string; createdAt?: string };
                            const catId = catItem._id || catItem.id || `cat-${index}`;
                            const createdDate = catItem.createdAt
                                ? new Date(catItem.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })
                                : null;

                            return (
                                <div
                                    key={catId}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-teal-500/40 hover:bg-slate-900/90 transition-all"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-105 transition-transform">
                                                    <Tags className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white text-base group-hover:text-teal-300 transition-colors">
                                                        {category.name}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                                            {category.description || (
                                                <span className="italic text-slate-600">No description provided</span>
                                            )}
                                        </p>
                                    </div>

                                    {createdDate && (
                                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="h-3 w-3 text-slate-600" />
                                                Created {createdDate}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
