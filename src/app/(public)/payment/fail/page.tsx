"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RotateCcw, HelpCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

function PaymentFailContent() {
    const searchParams = useSearchParams();

    const tranId =
        searchParams.get("tran_id") ||
        searchParams.get("transactionId") ||
        searchParams.get("tranId") ||
        "N/A";

    const reason = searchParams.get("message") || searchParams.get("error") || "Transaction failed or was declined.";

    useEffect(() => {
        toast.error("Payment transaction failed. Please try again.");
    }, []);

    return (
        <div className="w-full max-w-lg rounded-3xl border border-rose-500/30 bg-slate-900/80 p-8 sm:p-10 text-center backdrop-blur-2xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-500/20">
                <XCircle className="h-10 w-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Payment Failed
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                    Payment Unsuccessful
                </h1>
                <p className="text-slate-400 text-sm">
                    We could not process your transaction. No charges were made to your account.
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
                    <span className="text-slate-400">Status Message:</span>
                    <p className="text-rose-400 font-medium text-xs bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                        {reason}
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                    href="/dashboard/customer/orders"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-rose-500/20 hover:from-rose-400 hover:to-amber-400 transition-all"
                >
                    <RotateCcw className="h-4 w-4" />
                    <span>Try Payment Again</span>
                </Link>

                <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
                >
                    <HelpCircle className="h-4 w-4 text-teal-400" />
                    <span>Contact Support</span>
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

export default function PaymentFailPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <Suspense
                fallback={
                    <div className="text-slate-400 text-sm font-medium animate-pulse">
                        Loading payment details...
                    </div>
                }
            >
                <PaymentFailContent />
            </Suspense>
        </div>
    );
}
