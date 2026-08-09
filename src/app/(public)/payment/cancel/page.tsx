"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

function PaymentCancelContent() {
    const searchParams = useSearchParams();

    const tranId =
        searchParams.get("tran_id") ||
        searchParams.get("transactionId") ||
        searchParams.get("tranId") ||
        "N/A";

    useEffect(() => {
        toast.info("Payment session was cancelled.");
    }, []);

    return (
        <div className="w-full max-w-lg rounded-3xl border border-amber-500/30 bg-slate-900/80 p-8 sm:p-10 text-center backdrop-blur-2xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/20">
                <AlertCircle className="h-10 w-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Payment Cancelled
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                    Transaction Cancelled
                </h1>
                <p className="text-slate-400 text-sm">
                    You cancelled the payment gateway session. Your rental request remains pending payment in your dashboard.
                </p>
            </div>

            {tranId !== "N/A" && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-400">Transaction ID:</span>
                    <span className="font-mono font-bold text-white tracking-wide">{tranId}</span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                    href="/dashboard/customer/orders"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-teal-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-teal-400 transition-all"
                >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Back to My Orders</span>
                </Link>

                <Link
                    href="/gear"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
                >
                    <span>Browse Equipment</span>
                </Link>
            </div>

            <div className="pt-2">
                <Link
                    href="/dashboard/customer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Return to Customer Dashboard</span>
                </Link>
            </div>
        </div>
    );
}

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <Suspense
                fallback={
                    <div className="text-slate-400 text-sm font-medium animate-pulse">
                        Loading payment details...
                    </div>
                }
            >
                <PaymentCancelContent />
            </Suspense>
        </div>
    );
}
