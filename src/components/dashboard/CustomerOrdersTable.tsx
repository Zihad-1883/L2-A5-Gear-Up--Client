"use client";

import { useState } from "react";
import { TRentalOrder } from "@/app/types/rental";
import { cancelRentalOrder, createPaymentSession } from "@/lib/actions/customerActions";
import { toast } from "sonner";
import {
    ShoppingBag,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    RotateCcw,
    CreditCard,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerOrdersTableProps {
    initialOrders: TRentalOrder[];
}

export default function CustomerOrdersTable({ initialOrders }: CustomerOrdersTableProps) {
    const [orders, setOrders] = useState<TRentalOrder[]>(initialOrders);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to cancel this rental order?")) return;

        setLoadingId(orderId);
        try {
            const res = await cancelRentalOrder(orderId);
            if (res?.success) {
                toast.success(res?.message || "Order cancelled successfully");
                setOrders((prev) =>
                    prev.map((ord) =>
                        (ord._id === orderId || ord.id === orderId)
                            ? { ...ord, rentalOrderStatus: "CANCELLED" }
                            : ord
                    )
                );
            } else {
                toast.error(res?.message || "Failed to cancel order");
            }
        } catch (err) {
            console.error("Cancel order error:", err);
            toast.error("An error occurred while cancelling order.");
        } finally {
            setLoadingId(null);
        }
    };

    const findUrlInObject = (obj: unknown): string | null => {
        if (!obj) return null;
        if (typeof obj === "string" && (obj.startsWith("http://") || obj.startsWith("https://"))) {
            return obj;
        }
        if (typeof obj === "object" && obj !== null) {
            const record = obj as Record<string, unknown>;
            for (const key of Object.keys(record)) {
                if (key.startsWith("_")) continue;
                const found = findUrlInObject(record[key]);
                if (found) return found;
            }
        }
        return null;
    };

    const handlePayNow = async (orderId: string) => {
        setLoadingId(orderId);
        try {
            const res = await createPaymentSession(orderId);
            console.log("Payment session response:", res);

            const targetUrl = findUrlInObject(res);

            if (res?.success && targetUrl) {
                toast.success("Redirecting to SSLCommerz payment gateway...");
                window.location.assign(targetUrl);
            } else {
                toast.error(res?.message || "Failed to initiate payment session.");
            }
        } catch (err) {
            console.error("Payment error:", err);
            toast.error("An error occurred initiating payment.");
        } finally {
            setLoadingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status?.toUpperCase() || "PENDING";
        switch (s) {
            case "APPROVED":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approved
                    </span>
                );
            case "PENDING":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="h-3.5 w-3.5" />
                        Pending Approval
                    </span>
                );
            case "CANCELLED":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="h-3.5 w-3.5" />
                        Cancelled
                    </span>
                );
            case "REJECTED":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Rejected
                    </span>
                );
            case "PICKED_UP":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Truck className="h-3.5 w-3.5" />
                        Picked Up
                    </span>
                );
            case "RETURNED":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <RotateCcw className="h-3.5 w-3.5" />
                        Returned
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {status}
                    </span>
                );
        }
    };

    if (orders.length === 0) {
        return (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center flex flex-col items-center justify-center space-y-4 backdrop-blur-xl shadow-2xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white">No Rental Orders Yet</h3>
                <p className="text-sm text-slate-400 max-w-md">
                    You haven&apos;t placed any gear rental requests yet. Explore our gear catalog and book your equipment for your next adventure!
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/80 text-xs uppercase font-bold text-teal-400 tracking-wider border-b border-slate-800">
                        <tr>
                            <th className="py-4 px-6">Equipment</th>
                            <th className="py-4 px-6">Rental Dates</th>
                            <th className="py-4 px-6">Total Price</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                        {orders.map((order, idx) => {
                            const orderId = order._id || order.id || `ord-${idx}`;
                            const gearName =
                                order.gearItem?.name ||
                                order.gear?.name ||
                                "Gear Equipment";
                            const gearBrand =
                                order.gearItem?.brand ||
                                order.gear?.brand ||
                                "N/A";
                            const startDateStr = order.startDate
                                ? new Date(order.startDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })
                                : "N/A";
                            const endDateStr = order.endDate
                                ? new Date(order.endDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })
                                : "N/A";

                            const orderPrice = Number(order.totalPrice) || 0;
                            const isPending = order.rentalOrderStatus === "PENDING";
                            const isApproved = order.rentalOrderStatus === "APPROVED";
                            const isLoading = loadingId === orderId;

                            return (
                                <tr
                                    key={orderId}
                                    className="hover:bg-slate-800/40 transition-colors"
                                >
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-white text-base">{gearName}</div>
                                        <div className="text-xs text-slate-400">{gearBrand}</div>
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                                            <Calendar className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                                            <span>
                                                {startDateStr} &rarr; {endDateStr}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 font-extrabold text-white text-base">
                                        ${orderPrice.toFixed(2)}
                                    </td>

                                    <td className="py-4 px-6">
                                        {getStatusBadge(order.rentalOrderStatus)}
                                    </td>

                                    <td className="py-4 px-6 text-right space-x-2">
                                        {isApproved && (
                                            <Button
                                                onClick={() => handlePayNow(orderId)}
                                                disabled={isLoading}
                                                size="sm"
                                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                                            >
                                                <CreditCard className="h-3.5 w-3.5 mr-1" />
                                                Pay Now
                                            </Button>
                                        )}

                                        {isPending && (
                                            <Button
                                                onClick={() => handleCancelOrder(orderId)}
                                                disabled={isLoading}
                                                variant="destructive"
                                                size="sm"
                                                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs"
                                            >
                                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                                Cancel
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
