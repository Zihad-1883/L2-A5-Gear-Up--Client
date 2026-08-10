"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
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
                    Payment Cancelled
                </h1>
                <p className="text-slate-400 text-sm">
                    You have cancelled the payment checkout process. Your rental order remains saved as approved in your dashboard.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 text-left text-xs sm:text-sm">
                {tranId !== "N/A" && (
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                        <span className="text-slate-400">Transaction Ref:</span>
                        <span className="font-mono font-bold text-white tracking-wide">{tranId}</span>
                    </div>
                )}

                <div className="space-y-1">
                    <span className="text-slate-400">Notice:</span>
                    <p className="text-amber-400 font-medium text-xs bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                        You can resume and complete payment anytime from your Customer Dashboard under My Rental Orders.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                    href="/dashboard/customer/orders"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400 transition-all"
                >
                    <RotateCcw className="h-4 w-4" />
                    <span>Resume Payment</span>
                </Link>

                <Link
                    href="/dashboard/customer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
                >
                    <ArrowLeft className="h-4 w-4 text-teal-400" />
                    <span>Dashboard</span>
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
