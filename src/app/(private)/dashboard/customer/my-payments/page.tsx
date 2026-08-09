import { getMyPayments } from "@/lib/actions/customerActions";
import { TPayment } from "@/app/types/payment";
import {
    CreditCard,
    DollarSign,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    ShieldCheck,
    Receipt,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "My Payments | GearUp",
    description: "View and manage your payment history for gear rentals.",
};

export default async function MyPaymentsPage() {
    const response = await getMyPayments();
    const rawPayments = response?.data || response?.payments || [];
    const payments: TPayment[] = Array.isArray(rawPayments) ? rawPayments : [];

    const totalSpent = payments.reduce((sum, p) => {
        const isSuccessful = p.status === "PAID" || p.status === "VALID";
        const amt = Number(p.amount) || Number(p.rentalOrder?.totalPrice) || 0;
        return isSuccessful ? sum + amt : sum;
    }, 0);

    const successfulCount = payments.filter(
        (p) => p.status === "PAID" || p.status === "VALID"
    ).length;

    const getStatusBadge = (status?: string) => {
        const s = status?.toUpperCase() || "PENDING";
        switch (s) {
            case "PAID":
            case "VALID":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Paid & Verified
                    </span>
                );
            case "PENDING":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="h-3.5 w-3.5" />
                        Pending Payment
                    </span>
                );
            case "FAILED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="h-3.5 w-3.5" />
                        Failed
                    </span>
                );
            case "CANCELLED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 p-8 shadow-2xl backdrop-blur-xl">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-400">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>SSLCommerz Secured Payments</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                            Payment History
                        </h1>
                        <p className="text-sm text-slate-400 max-w-xl">
                            Track all your rental transactions, payment gateway statuses, and digital receipts in one place.
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-3 shrink-0">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 min-w-[130px]">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <DollarSign className="h-3.5 w-3.5 text-teal-400" />
                                <span>Total Spent</span>
                            </div>
                            <div className="text-xl font-extrabold text-white mt-1">
                                ${totalSpent.toFixed(2)}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 min-w-[130px]">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Receipt className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Successful</span>
                            </div>
                            <div className="text-xl font-extrabold text-emerald-400 mt-1">
                                {successfulCount} / {payments.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            {payments.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center flex flex-col items-center justify-center space-y-4 backdrop-blur-xl shadow-2xl">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <CreditCard className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No Payment Records Yet</h3>
                    <p className="text-sm text-slate-400 max-w-md">
                        You haven&apos;t completed any rental payments yet. When you pay for an approved rental order, details will be recorded here.
                    </p>
                </div>
            ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-xl shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950/80 text-xs uppercase font-bold text-teal-400 tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="py-4 px-6">Transaction Ref</th>
                                    <th className="py-4 px-6">Amount</th>
                                    <th className="py-4 px-6">Gateway</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80">
                                {payments.map((payment, idx) => {
                                    const payId = payment._id || payment.id || `pay-${idx}`;
                                    const tranId = payment.transactionId || `TXN-${payId.slice(-8).toUpperCase()}`;
                                    const amount = Number(payment.amount) || Number(payment.rentalOrder?.totalPrice) || 0;
                                    const dateStr = payment.createdAt
                                        ? new Date(payment.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "N/A";

                                    return (
                                        <tr key={payId} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-mono font-bold text-white text-sm">
                                                    {tranId}
                                                </div>
                                                <div className="text-[11px] text-slate-500 font-mono">
                                                    Order: {payment.rentalOrderId || payment.rentalOrder?._id || "N/A"}
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="font-extrabold text-white text-base">
                                                    ${amount.toFixed(2)}
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                                                    <CreditCard className="h-3.5 w-3.5 text-teal-400" />
                                                    SSLCommerz
                                                </span>
                                            </td>

                                            <td className="py-4 px-6">
                                                {getStatusBadge(payment.status)}
                                            </td>

                                            <td className="py-4 px-6 text-right text-xs text-slate-400 font-medium">
                                                {dateStr}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}