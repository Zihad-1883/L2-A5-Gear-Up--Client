"use client";

import { useState } from "react";
import { TRentalOrder, TRentalStatus } from "@/app/types/rental";
import { updateOrderStatus } from "@/lib/actions/providerActions";
import { toast } from "sonner";
import {
    ShoppingBag,
    Calendar,
    User,
    Mail,
    CheckCircle2,
    XCircle,
    Truck,
    RotateCcw,
    Clock,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProviderOrdersTableProps {
    initialOrders: TRentalOrder[];
}

export default function ProviderOrdersTable({ initialOrders }: ProviderOrdersTableProps) {
    const [orders, setOrders] = useState<TRentalOrder[]>(initialOrders);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleStatusChange = async (orderId: string, newStatus: TRentalStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await updateOrderStatus(orderId, newStatus);
            if (res?.success) {
                toast.success(res?.message || `Order status updated to ${newStatus}`);
                setOrders((prev) =>
                    prev.map((ord) =>
                        (ord._id === orderId || ord.id === orderId)
                            ? { ...ord, rentalOrderStatus: newStatus }
                            : ord
                    )
                );
            } else {
                toast.error(res?.message || "Failed to update order status");
            }
        } catch (err) {
            console.error("Update status error:", err);
            toast.error("An error occurred while updating order status.");
        } finally {
            setUpdatingId(null);
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
                <h3 className="text-xl font-bold text-white">No Orders Received</h3>
                <p className="text-sm text-slate-400 max-w-md">
                    You haven&apos;t received any gear rental orders from customers yet. When customers request your equipment, they will appear here!
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
                            <th className="py-4 px-6">Customer</th>
                            <th className="py-4 px-6">Rental Dates</th>
                            <th className="py-4 px-6">Total Cost</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Update Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                        {orders.map((order: TRentalOrder, idx: number) => {
                            const orderId = order._id || order.id || `ord-${idx}`;
                            const gearName =
                                order.gearItem?.name ||
                                order.gear?.name ||
                                "Equipment";
                            const gearBrand =
                                order.gearItem?.brand ||
                                order.gear?.brand ||
                                "N/A";
                            const customerName =
                                order.customer?.name ||
                                order.user?.name ||
                                "Customer";
                            const customerEmail =
                                order.customer?.email ||
                                order.user?.email ||
                                "No email";
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
                            const isUpdating = updatingId === orderId;
                            const currentStatus = order.rentalOrderStatus?.toUpperCase() || "PENDING";
                            const paymentStatus = order.paymentStatus?.toUpperCase();

                            const isPending = currentStatus === "PENDING";
                            const canMarkPickedUp =
                                (currentStatus === "APPROVED" || currentStatus === "PAID" || paymentStatus === "PAID") &&
                                currentStatus !== "PICKED_UP" &&
                                currentStatus !== "RETURNED";
                            const canMarkReturned = currentStatus === "PICKED_UP";

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
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                                            <User className="h-3.5 w-3.5 text-teal-400" />
                                            <span>{customerName}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                            <Mail className="h-3 w-3" />
                                            <span>{customerEmail}</span>
                                        </div>
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

                                    <td className="py-4 px-6 space-y-1">
                                        <div>{getStatusBadge(currentStatus)}</div>
                                        {paymentStatus === "PAID" && (
                                            <div>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Payment Received
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    
                                    <td className="py-4 px-6 text-right">
                                        {isUpdating ? (
                                            <div className="inline-flex items-center gap-1 text-xs text-teal-400 font-semibold">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Updating...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-end gap-1.5">
                                                {isPending && (
                                                    <>
                                                        <Button
                                                            onClick={() => handleStatusChange(orderId, "APPROVED")}
                                                            size="sm"
                                                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleStatusChange(orderId, "REJECTED")}
                                                            variant="destructive"
                                                            size="sm"
                                                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}

                                                {canMarkPickedUp && (
                                                    <Button
                                                        onClick={() => handleStatusChange(orderId, "PICKED_UP")}
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md border border-blue-400/30 transition-all hover:scale-105"
                                                    >
                                                        <Truck className="h-3.5 w-3.5 mr-1" />
                                                        Mark Picked Up
                                                    </Button>
                                                )}

                                                {canMarkReturned && (
                                                    <Button
                                                        onClick={() => handleStatusChange(orderId, "RETURNED")}
                                                        size="sm"
                                                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md border border-teal-400/30 transition-all hover:scale-105"
                                                    >
                                                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                                        Mark Returned
                                                    </Button>
                                                )}

                                                {currentStatus === "RETURNED" && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Returned (Completed)
                                                    </span>
                                                )}

                                                {(currentStatus === "REJECTED" || currentStatus === "CANCELLED") && (
                                                    <span className="text-xs text-slate-500 italic">No actions available</span>
                                                )}
                                            </div>
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
