"use client";

import { useState } from "react";
import { TRentalOrder, TRentalStatus } from "@/app/types/rental";
import { updateOrderStatusAdmin } from "@/lib/actions/adminActions";
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
    Search,
    ShieldAlert,
    Eye,
    DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface AdminOrdersTableProps {
    initialOrders: TRentalOrder[];
}

export default function AdminOrdersTable({ initialOrders }: AdminOrdersTableProps) {
    const [orders, setOrders] = useState<TRentalOrder[]>(initialOrders);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedOrderDetails, setSelectedOrderDetails] = useState<TRentalOrder | null>(null);

    const handleStatusChange = async (orderId: string, newStatus: TRentalStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await updateOrderStatusAdmin(orderId, newStatus);
            if (res?.success || res?.statusCode === 200) {
                toast.success(res?.message || `Order status updated to ${newStatus}`);
                setOrders((prev) =>
                    prev.map((ord) =>
                        (ord._id === orderId || ord.id === orderId)
                            ? { ...ord, rentalOrderStatus: newStatus }
                            : ord
                    )
                );
                if (selectedOrderDetails && (selectedOrderDetails._id === orderId || selectedOrderDetails.id === orderId)) {
                    setSelectedOrderDetails((prev) => prev ? { ...prev, rentalOrderStatus: newStatus } : null);
                }
            } else {
                toast.error(res?.message || "Failed to update order status");
            }
        } catch (err) {
            console.error("Admin update status error:", err);
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
                        Pending
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

    const filteredOrders = orders.filter((order) => {
        const query = searchQuery.toLowerCase().trim();
        const gearName = (order.gearItem?.name || order.gear?.name || "").toLowerCase();
        const gearBrand = (order.gearItem?.brand || order.gear?.brand || "").toLowerCase();
        const customerName = (order.customer?.name || order.user?.name || "").toLowerCase();
        const customerEmail = (order.customer?.email || order.user?.email || "").toLowerCase();
        const orderId = (order._id || order.id || "").toLowerCase();

        const matchesQuery =
            !query ||
            gearName.includes(query) ||
            gearBrand.includes(query) ||
            customerName.includes(query) ||
            customerEmail.includes(query) ||
            orderId.includes(query);

        const currentStatus = order.rentalOrderStatus?.toUpperCase() || "";
        const matchesStatus = !statusFilter || currentStatus === statusFilter;

        return matchesQuery && matchesStatus;
    });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.rentalOrderStatus?.toUpperCase() === "PENDING").length;
    const activeOrders = orders.filter((o) => ["APPROVED", "PICKED_UP"].includes(o.rentalOrderStatus?.toUpperCase() || "")).length;
    const totalVolume = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

    return (
        <div className="space-y-6">
            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Total Rental Orders</p>
                        <p className="text-xl font-extrabold text-white">{totalOrders} Orders</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Pending Approval</p>
                        <p className="text-xl font-extrabold text-amber-400">{pendingOrders} Pending</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Truck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Active Rentals</p>
                        <p className="text-xl font-extrabold text-blue-400">{activeOrders} Active</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Total Rental Volume</p>
                        <p className="text-xl font-extrabold text-emerald-400">${totalVolume.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by equipment, customer name, email, order ID..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                </div>

                <div className="w-full sm:w-56">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-100 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="PICKED_UP">PICKED UP</option>
                        <option value="RETURNED">RETURNED</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </div>
            </div>

            {/* Rental Orders Moderation Table */}
            {orders.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center flex flex-col items-center justify-center space-y-4 backdrop-blur-xl shadow-2xl">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <ShoppingBag className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No Rental Orders Found</h3>
                    <p className="text-sm text-slate-400 max-w-md">
                        There are currently no rental orders registered across the platform.
                    </p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center flex flex-col items-center justify-center space-y-2 backdrop-blur-md">
                    <Search className="h-8 w-8 text-slate-600 mb-1" />
                    <h4 className="text-base font-bold text-slate-300">No matching orders found</h4>
                    <p className="text-xs text-slate-500">
                        No rental order matched your search or status filter. Try clearing filters.
                    </p>
                </div>
            ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-xl shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950/80 text-xs uppercase font-bold text-teal-400 tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="py-4 px-6">Equipment</th>
                                    <th className="py-4 px-6">Customer</th>
                                    <th className="py-4 px-6">Rental Duration</th>
                                    <th className="py-4 px-6">Total Price</th>
                                    <th className="py-4 px-6">Order Status</th>
                                    <th className="py-4 px-6 text-right">Moderation Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80">
                                {filteredOrders.map((order, idx) => {
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
                                                            Paid
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
                                                        <button
                                                            onClick={() => setSelectedOrderDetails(order)}
                                                            className="inline-flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                                                            title="Inspect Order Details"
                                                        >
                                                            <Eye className="h-3.5 w-3.5 text-teal-400" />
                                                            <span>Inspect</span>
                                                        </button>

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
                                                                Picked Up
                                                            </Button>
                                                        )}

                                                        {canMarkReturned && (
                                                            <Button
                                                                onClick={() => handleStatusChange(orderId, "RETURNED")}
                                                                size="sm"
                                                                className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md border border-teal-400/30 transition-all hover:scale-105"
                                                            >
                                                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                                                Returned
                                                            </Button>
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
            )}

            {/* Detailed Inspection Modal */}
            <Dialog open={!!selectedOrderDetails} onOpenChange={(open) => !open && setSelectedOrderDetails(null)}>
                <DialogContent className="max-w-lg bg-slate-900 border-slate-800 text-slate-100 shadow-2xl rounded-2xl p-6">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-white">Rental Order Moderation Details</DialogTitle>
                                <DialogDescription className="text-xs text-slate-400">
                                    Order ID: {selectedOrderDetails?._id || selectedOrderDetails?.id}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedOrderDetails && (
                        <div className="space-y-4 py-3 text-xs text-slate-300 divide-y divide-slate-800/80">
                            <div className="space-y-2 pb-2">
                                <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Equipment Listing</h4>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white text-sm">
                                        {selectedOrderDetails.gearItem?.name || selectedOrderDetails.gear?.name || "Equipment"}
                                    </span>
                                    <span className="text-slate-400">
                                        Brand: {selectedOrderDetails.gearItem?.brand || selectedOrderDetails.gear?.brand || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 py-2">
                                <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Customer Information</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-slate-400">Customer Name:</p>
                                        <p className="font-semibold text-white">{selectedOrderDetails.customer?.name || selectedOrderDetails.user?.name || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Email Address:</p>
                                        <p className="font-semibold text-white">{selectedOrderDetails.customer?.email || selectedOrderDetails.user?.email || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 py-2">
                                <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Rental Period & Price</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-slate-400">Start Date:</p>
                                        <p className="font-semibold text-white">
                                            {selectedOrderDetails.startDate ? new Date(selectedOrderDetails.startDate).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">End Date:</p>
                                        <p className="font-semibold text-white">
                                            {selectedOrderDetails.endDate ? new Date(selectedOrderDetails.endDate).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Total Price:</p>
                                        <p className="font-extrabold text-teal-400 text-sm">
                                            ${(Number(selectedOrderDetails.totalPrice) || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Current Status:</p>
                                        <div className="mt-0.5">{getStatusBadge(selectedOrderDetails.rentalOrderStatus)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
