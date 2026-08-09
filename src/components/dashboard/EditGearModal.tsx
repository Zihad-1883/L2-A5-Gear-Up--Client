"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TGear, TCreateGears } from "@/app/types/gear";
import { TCategory } from "@/app/types/category";
import { updateGear } from "@/lib/actions/providerActions";
import { toast } from "sonner";
import {
    Pencil,
    Package,
    Building2,
    Layers,
    DollarSign,
    Boxes,
    FileText,
    Loader2,
    Image as ImageIcon,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface EditGearModalProps {
    gear: TGear | null;
    categories: TCategory[];
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedGear: TGear) => void;
}

const getCategoryId = (g: TGear | null): string => {
    if (!g) return "";
    if (typeof g.categoryId === "string") return g.categoryId;
    if (typeof g.categoryId === "object" && g.categoryId) {
        return g.categoryId._id || g.categoryId.id || "";
    }
    if (g.category) {
        return g.category._id || g.category.id || "";
    }
    return "";
};

const getInitialFormState = (gear: TGear | null) => ({
    name: gear?.name || "",
    brand: gear?.brand || "",
    categoryId: getCategoryId(gear),
    price: gear?.price !== undefined ? gear.price : ("" as string | number),
    stock: gear?.stock !== undefined ? gear.stock : ("" as string | number),
    description: gear?.description || "",
    imageUrl:
        gear?.imageUrl ||
        gear?.photoUrl ||
        gear?.photo ||
        gear?.image ||
        (gear?.images && gear.images[0]) ||
        "",
});

export default function EditGearModal({
    gear,
    categories,
    isOpen,
    onClose,
    onSuccess,
}: EditGearModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentGearId = gear ? gear._id || gear.id || null : null;
    const [prevGearId, setPrevGearId] = useState<string | null>(currentGearId);
    const [editForm, setEditForm] = useState(() => getInitialFormState(gear));

    if (currentGearId !== prevGearId) {
        setPrevGearId(currentGearId);
        setEditForm(getInitialFormState(gear));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gear) return;

        const gearId = gear._id || gear.id;
        if (!gearId) return;

        if (!editForm.name.trim()) {
            toast.error("Gear name is required");
            return;
        }
        if (!editForm.brand.trim()) {
            toast.error("Brand is required");
            return;
        }
        if (!editForm.categoryId) {
            toast.error("Category is required");
            return;
        }

        setIsSubmitting(true);

        try {
            const photoUrl = editForm.imageUrl.trim();
            const payload: Partial<TCreateGears> = {
                name: editForm.name.trim(),
                brand: editForm.brand.trim(),
                categoryId: editForm.categoryId,
                price: Number(editForm.price) || 0,
                stock: Number(editForm.stock) || 0,
                description: editForm.description.trim(),
                photoUrl: photoUrl || undefined,
            };

            const res = await updateGear(gearId, payload);

            if (res?.success || res?.statusCode === 200 || res?.data || res?.id || res?._id) {
                toast.success(res?.message || "Gear item updated successfully!");

                const updatedCategoryObj = categories.find(
                    (c) => (c.id || c._id) === editForm.categoryId
                );

                const updatedGearItem: TGear = {
                    ...gear,
                    name: payload.name!,
                    brand: payload.brand!,
                    categoryId: payload.categoryId!,
                    category: updatedCategoryObj
                        ? {
                            id: updatedCategoryObj.id || updatedCategoryObj._id,
                            name: updatedCategoryObj.name,
                        }
                        : gear.category,
                    price: payload.price!,
                    stock: payload.stock!,
                    description: payload.description!,
                    imageUrl: photoUrl || gear.imageUrl,
                    images: photoUrl ? [photoUrl] : gear.images,
                };

                onSuccess(updatedGearItem);
                onClose();
                router.refresh();
            } else {
                toast.error(res?.message || "Failed to update gear item.");
            }
        } catch (err) {
            console.error("Error updating gear:", err);
            toast.error("An error occurred while updating gear item.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg bg-slate-900 border-slate-800 text-slate-100 shadow-2xl rounded-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Pencil className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-white">Edit Gear Listing</DialogTitle>
                            <DialogDescription className="text-xs text-slate-400">
                                Update the details, pricing, and stock of your equipment.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5 text-amber-400" />
                            Gear Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            placeholder="e.g. Sony Alpha A7 IV"
                            required
                            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                        />
                    </div>

                    {/* Brand & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5 text-amber-400" />
                                Brand <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={editForm.brand}
                                onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                                placeholder="e.g. Sony"
                                required
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                <Layers className="h-3.5 w-3.5 text-amber-400" />
                                Category <span className="text-rose-400">*</span>
                            </label>
                            <select
                                value={editForm.categoryId}
                                onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                                required
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                            >
                                <option value="">Select Category</option>
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

                    {/* Price & Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                <DollarSign className="h-3.5 w-3.5 text-amber-400" />
                                Price ($/day) <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editForm.price}
                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                required
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                <Boxes className="h-3.5 w-3.5 text-amber-400" />
                                Stock Count <span className="text-rose-400">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={editForm.stock}
                                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                required
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Photo URL */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                            <ImageIcon className="h-3.5 w-3.5 text-amber-400" />
                            Equipment Photo URL
                        </label>
                        <input
                            type="url"
                            value={editForm.imageUrl}
                            onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                        />
                        {editForm.imageUrl && editForm.imageUrl.trim() !== "" && (
                            <div className="relative mt-2 h-32 w-full max-w-xs rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={editForm.imageUrl.trim()}
                                    alt="Gear preview"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop";
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-amber-400" />
                            Description
                        </label>
                        <textarea
                            rows={4}
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            placeholder="Details about this equipment..."
                            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                        />
                    </div>

                    <DialogFooter className="pt-3 gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                <>
                                    <Pencil className="h-4 w-4" />
                                    <span>Update Gear</span>
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
