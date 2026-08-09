"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TGear } from "@/app/types/gear";
import { deleteGear } from "@/lib/actions/providerActions";
import { toast } from "sonner";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface DeleteGearModalProps {
    gear: TGear | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (deletedGearId: string) => void;
}

export default function DeleteGearModal({
    gear,
    isOpen,
    onClose,
    onSuccess,
}: DeleteGearModalProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        if (!gear) return;

        const gearId = gear._id || gear.id;
        if (!gearId) return;

        setIsDeleting(true);

        try {
            const res = await deleteGear(gearId);

            if (res?.success || res?.statusCode === 200) {
                toast.success(res?.message || "Gear item deleted successfully!");
                onSuccess(gearId);
                onClose();
                router.refresh();
            } else {
                toast.error(res?.message || "Failed to delete gear item.");
            }
        } catch (err) {
            console.error("Error deleting gear:", err);
            toast.error("An error occurred while deleting gear item.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl rounded-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl border bg-rose-500/10 text-rose-400 border-rose-500/30">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-white">
                            Confirm Gear Deletion
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-400 text-sm">
                        Are you sure you want to delete{" "}
                        <strong className="text-slate-200">{gear?.name}</strong>?
                        <br />
                        This will permanently remove this item from your provider inventory and users will no longer be able to rent it.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-900/30 transition-all disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                <span>Yes, Delete Item</span>
                            </>
                        )}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
