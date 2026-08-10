"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, CreditCard } from "lucide-react";
import { toast } from "sonner";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();

    const tranId =
        searchParams.get("tran_id") ||
        searchParams.get("transactionId") ||
        searchParams.get("tranId") ||
        searchParams.get("val_id") ||
        "N/A";

    const amount = searchParams.get("amount") || searchParams.get("total_amount");
    const currency = searchParams.get("currency") || "BDT";

    useEffect(() => {
        toast.success("Payment completed successfully!");
    }, []);

    return (
        <div className="w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-8 sm:p-10 text-center backdrop-blur-2xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Payment Confirmed
                </span>
                <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                    Payment Successful!
                </h1>
                <p className="text-slate-400 text-sm">
                    Thank you! Your payment session has been validated and your rental booking is officially confirmed.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 text-left text-xs sm:text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-teal-400" />
                        Transaction ID:
                    </span>
                    <span className="font-mono font-bold text-white tracking-wide">{tranId}</span>
                </div>

                {amount && (
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                        <span className="text-slate-400">Amount Paid:</span>
                        <span className="font-extrabold text-emerald-400 text-base">
                            {amount} {currency}
                        </span>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status:</span>
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-xs">
                        PAID & VERIFIED
                    </span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                    href="/dashboard/customer/orders"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400 transition-all"
                >
                    <ShoppingBag className="h-4 w-4" />
                    <span>My Rental Orders</span>
                </Link>

                <Link
                    href="/gear"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
                >
                    <span>Browse Gear</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <Suspense
                fallback={
                    <div className="text-slate-400 text-sm font-medium animate-pulse">
                        Loading payment verification...
                    </div>
                }
            >
                <PaymentSuccessContent />
            </Suspense>
        </div>
    );
}
