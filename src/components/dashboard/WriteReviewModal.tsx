"use client";

import { useState } from "react";
import { Star, MessageSquare, Loader2, Sparkles, X } from "lucide-react";
import { createReview } from "@/lib/actions/customerActions";
import { toast } from "sonner";

interface WriteReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    gearItemId: string;
    gearName: string;
    gearBrand?: string;
    onSuccess?: () => void;
}

export default function WriteReviewModal({
    isOpen,
    onClose,
    gearItemId,
    gearName,
    gearBrand,
    onSuccess,
}: WriteReviewModalProps) {
    const [rating, setRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error("Please enter a comment for your review.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await createReview({
                gearItemId,
                rating,
                comment: comment.trim(),
            });

            if (res?.success || res?.status === 200 || res?.status === 201 || res?.data) {
                toast.success("Thank you! Your review has been submitted successfully.");
                onSuccess?.();
                onClose();
            } else {
                toast.error(res?.message || "Failed to submit review. Please try again.");
            }
        } catch (error) {
            console.error("Submit review error:", error);
            toast.error("An error occurred while submitting your review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const ratingLabels = [
        "Select Rating",
        "Poor - 1 Star",
        "Fair - 2 Stars",
        "Good - 3 Stars",
        "Very Good - 4 Stars",
        "Excellent - 5 Stars",
    ];

    const currentRating = hoverRating || rating;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6 relative">
                {/* Close Button Top Right */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Close modal"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Modal Header */}
                <div className="space-y-1.5 pr-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Write a Review</h2>
                            <p className="text-xs text-teal-400 font-semibold">{gearName} {gearBrand ? `(${gearBrand})` : ""}</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 pt-1">
                        Share your rental experience and equipment performance to help the community.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Interactive Star Rating */}
                    <div className="space-y-2 text-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                        <label className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
                            Rating: <span className="text-amber-400 lowercase font-bold">{ratingLabels[currentRating]}</span>
                        </label>
                        <div className="flex items-center justify-center gap-2 py-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 focus:outline-none transition-transform hover:scale-125 duration-150"
                                >
                                    <Star
                                        className={`h-7 w-7 transition-colors ${
                                            star <= currentRating
                                                ? "fill-amber-400 stroke-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                                : "text-slate-700 stroke-slate-700 hover:text-slate-500"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Comment Box */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-teal-400" />
                            Detailed Review / Feedback:
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            placeholder="How was the equipment condition, performance, and rental experience?"
                            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50 resize-none"
                            required
                        />
                    </div>

                    {/* Modal Footer Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-lg shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 fill-slate-950" />
                                    <span>Submit Review</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

