"use client";

import { useState, useEffect } from "react";
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
    Loader2,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import WriteReviewModal from "./WriteReviewModal";

interface CustomerOrdersTableProps {
    initialOrders: TRentalOrder[];
}

export default function CustomerOrdersTable({ initialOrders }: CustomerOrdersTableProps) {
    const [orders, setOrders] = useState<TRentalOrder[]>(initialOrders);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [orderToCancel, setOrderToCancel] = useState<TRentalOrder | null>(null);
    const [reviewOrder, setReviewOrder] = useState<TRentalOrder | null>(null);
    const [reviewedOrderIds, setReviewedOrderIds] = useState<Record<string, boolean>>({});

    useEffect(() => {
        try {
            const saved = localStorage.getItem("gearup_reviewed_orders");
            if (saved) {
                const parsed = JSON.parse(saved);
                queueMicrotask(() => {
                    setReviewedOrderIds(parsed);
                });
            }
        } catch (e) {
            console.error("Failed to parse reviewed orders from localStorage", e);
        }
    }, []);

    const handleReviewSuccess = (orderId: string, gearItemId: string) => {
        setReviewedOrderIds((prev) => {
            const updated = { ...prev, [orderId]: true, [gearItemId]: true };
            try {
                localStorage.setItem("gearup_reviewed_orders", JSON.stringify(updated));
            } catch (e) {
                console.error("Failed to save reviewed orders to localStorage", e);
            }
            return updated;
        });
    };

    const handleConfirmCancel = async () => {
        if (!orderToCancel) return;

        const orderId = orderToCancel._id || orderToCancel.id;
        if (!orderId) return;

        setLoadingId(orderId);
        try {
            const res = await cancelRentalOrder(orderId);
            if (res?.success) {
                toast.success(res?.message || "Rental order cancelled successfully");
                setOrders((prev) =>
                    prev.map((ord) =>
                        (ord._id === orderId || ord.id === orderId)
                            ? { ...ord, rentalOrderStatus: "CANCELLED" }
                            : ord
                    )
                );
                setOrderToCancel(null);
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

            const targetUrl =
                res?.data?.paymentUrl ||
                res?.data?.gatewayUrl ||
                res?.data?.url ||
                res?.data?.GatewayPageURL ||
                res?.paymentUrl ||
                res?.url ||
                findUrlInObject(res);

            if ((res?.success || res?.statusCode === 200) && targetUrl) {
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

    const cancelGearName =
        orderToCancel?.gearItem?.name ||
        orderToCancel?.gear?.name ||
        "this equipment";

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
                        {orders.map((order: TRentalOrder, idx: number) => {
                            const orderId = order._id || order.id || `ord-${idx}`;
                            const gearItemId = order.gearItemId || order.gearItem?._id || order.gearItem?.id || order.gear?._id || order.gear?.id || "";
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
                            const isReturned = order.rentalOrderStatus === "RETURNED";
                            const isPaid = order.paymentStatus?.toUpperCase() === "PAID";
                            const isLoading = loadingId === orderId;

                            const isAlreadyReviewed =
                                Boolean(order.isReviewed) ||
                                Boolean(reviewedOrderIds[orderId]) ||
                                Boolean(gearItemId && reviewedOrderIds[gearItemId]);

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

                                    <td className="py-4 px-6 space-y-1">
                                        <div>{getStatusBadge(order.rentalOrderStatus)}</div>
                                        {isPaid && (
                                            <div>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Payment Received
                                                </span>
                                            </div>
                                        )}
                                    </td>

                                    <td className="py-4 px-6 text-right space-x-2">
                                        {isApproved && !isPaid && (
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

                                        {isApproved && isPaid && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Paid
                                            </span>
                                        )}

                                        {isPending && (
                                            <Button
                                                onClick={() => setOrderToCancel(order)}
                                                disabled={isLoading}
                                                variant="destructive"
                                                size="sm"
                                                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs"
                                            >
                                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                                Cancel
                                            </Button>
                                        )}

                                        {isReturned && (
                                            isAlreadyReviewed ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Reviewed
                                                </span>
                                            ) : (
                                                <Button
                                                    onClick={() => setReviewOrder(order)}
                                                    size="sm"
                                                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all hover:scale-105"
                                                >
                                                    <Star className="h-3.5 w-3.5 mr-1 fill-amber-400" />
                                                    Write Review
                                                </Button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Cancel Order Modal Confirmation */}
            <Dialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
                <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl rounded-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-xl border bg-rose-500/10 text-rose-400 border-rose-500/30">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <DialogTitle className="text-lg font-bold text-white">
                                Cancel Rental Order
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-slate-400 text-sm">
                            Are you sure you want to cancel your rental request for{" "}
                            <strong className="text-slate-200">{cancelGearName}</strong>?
                            <br />
                            This will update the order status to cancelled and free up the rental reservation.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4 gap-2">
                        <button
                            type="button"
                            onClick={() => setOrderToCancel(null)}
                            disabled={loadingId === (orderToCancel?._id || orderToCancel?.id)}
                            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
                        >
                            Keep Order
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmCancel}
                            disabled={loadingId === (orderToCancel?._id || orderToCancel?.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-900/30 transition-all disabled:opacity-50"
                        >
                            {loadingId === (orderToCancel?._id || orderToCancel?.id) ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Cancelling...</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4" />
                                    <span>Yes, Cancel Order</span>
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Write Review Modal */}
            {reviewOrder && (
                <WriteReviewModal
                    isOpen={!!reviewOrder}
                    onClose={() => setReviewOrder(null)}
                    gearItemId={reviewOrder.gearItemId || reviewOrder.gearItem?._id || reviewOrder.gearItem?.id || reviewOrder.gear?._id || reviewOrder.gear?.id || ""}
                    gearName={reviewOrder.gearItem?.name || reviewOrder.gear?.name || "Equipment"}
                    gearBrand={reviewOrder.gearItem?.brand || reviewOrder.gear?.brand}
                    onSuccess={() => {
                        const currentOrderId = reviewOrder._id || reviewOrder.id || "";
                        const currentGearId = reviewOrder.gearItemId || reviewOrder.gearItem?._id || reviewOrder.gearItem?.id || reviewOrder.gear?._id || reviewOrder.gear?.id || "";
                        handleReviewSuccess(currentOrderId, currentGearId);
                    }}
                />
            )}
        </div>
    );
}
