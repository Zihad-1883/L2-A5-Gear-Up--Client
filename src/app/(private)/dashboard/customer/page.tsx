import { getMyRentalOrders } from "@/lib/actions/customerActions";
import { cookies } from "next/headers";
import { verifyToken } from "@/utilis/jwt";
import Link from "next/link";
import {
    ShoppingBag,
    Clock,
    CreditCard,
    CheckCircle2,
    Truck,
    ArrowRight,
    Sparkles,
    Calendar,
    Compass,
    RotateCcw,
    ChevronRight,
    Tag,
} from "lucide-react";
import { TRentalOrder } from "@/app/types/rental";

export const dynamic = "force-dynamic";

const CustomerDashboardPage = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const verifiedToken = accessToken
        ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!)
        : null;
    const currentUser = verifiedToken?.success && verifiedToken.data ? verifiedToken.data : null;

    const ordersRes = await getMyRentalOrders();

    const orders: TRentalOrder[] = Array.isArray(ordersRes)
        ? ordersRes
        : ordersRes?.data || ordersRes?.result || [];

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
        (o: TRentalOrder) => (o.rentalOrderStatus || "PENDING").toUpperCase() === "PENDING"
    ).length;
    const approvedOrders = orders.filter(
        (o: TRentalOrder) => (o.rentalOrderStatus || "").toUpperCase() === "APPROVED"
    ).length;
    const activeRentals = orders.filter(
        (o: TRentalOrder) => (o.rentalOrderStatus || "").toUpperCase() === "PICKED_UP"
    ).length;
    const completedRentals = orders.filter(
        (o: TRentalOrder) => (o.rentalOrderStatus || "").toUpperCase() === "RETURNED"
    ).length;

    const recentOrders = orders.slice(0, 5);

    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const getStatusBadge = (status: string) => {
        const s = status?.toUpperCase() || "PENDING";
        switch (s) {
            case "PENDING":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="h-3 w-3" />
                        Pending Approval
                    </span>
                );
            case "APPROVED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved — Ready to Pay
                    </span>
                );
            case "PICKED_UP":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Truck className="h-3 w-3" />
                        Picked Up
                    </span>
                );
            case "RETURNED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <RotateCcw className="h-3 w-3" />
                        Returned & Closed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {s}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-8">

            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Customer Portal</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                            Welcome back,{" "}
                            <span className="bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                                {currentUser?.name || "Customer"}
                            </span>
                        </h1>
                        <p className="text-sm text-slate-400 max-w-xl">
                            Track your camera and audio gear rentals, process online SSLCommerz payments, and browse available equipment catalog.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/60 border border-slate-800/80 px-4 py-2.5 rounded-2xl">
                            <Calendar className="h-4 w-4 text-teal-400" />
                            <span>{currentDate}</span>
                        </div>
                        <Link
                            href="/gear"
                            className="inline-flex items-center gap-2 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 text-xs shadow-lg shadow-teal-500/20 transition-all"
                        >
                            <Compass className="h-4 w-4" />
                            Explore Gear Catalog
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-teal-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Total Bookings</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            <ShoppingBag className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-white">{totalOrders}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-teal-400">
                        <Link href="/dashboard/customer/orders" className="hover:underline flex items-center gap-1">
                            View order history <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Approved (Ready to Pay)</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CreditCard className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-white">{approvedOrders}</p>
                    <div className="mt-2 text-xs text-emerald-400 font-medium">
                        {approvedOrders > 0 ? "Action required: Complete payment" : "No pending payments"}
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-blue-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Active Gear Rentals</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Truck className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-white">{activeRentals}</p>
                    <div className="mt-2 text-xs text-blue-400">
                        Currently in your possession
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-purple-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Completed Rentals</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-white">{completedRentals}</p>
                    <div className="mt-2 text-xs text-slate-400">
                        <span className="text-slate-400">{pendingOrders} awaiting provider review</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/gear"
                    className="group flex items-center justify-between p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-teal-500/30 transition-all"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                            <Compass className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">Browse Gear Catalog</h3>
                            <p className="text-xs text-slate-400">Find cameras, lenses, & audio equipment</p>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                    href="/dashboard/customer/orders"
                    className="group flex items-center justify-between p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-blue-500/30 transition-all"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">My Rental Orders</h3>
                            <p className="text-xs text-slate-400">View status & pay approved bookings</p>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                    href="/dashboard/customer/my-payments"
                    className="group flex items-center justify-between p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-purple-500/30 transition-all"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Payment History</h3>
                            <p className="text-xs text-slate-400">View completed transactions & invoices</p>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-white">Your Rental Bookings</h2>
                        <p className="text-xs text-slate-400">Recent equipment rental requests and their live statuses</p>
                    </div>
                    <Link
                        href="/dashboard/customer/orders"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                    >
                        View All Orders <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 space-y-3">
                        <ShoppingBag className="h-10 w-10 text-slate-600 mx-auto" />
                        <p className="text-sm font-medium text-slate-400">No rental orders placed yet.</p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Browse our gear catalog to rent professional production equipment.
                        </p>
                        <Link
                            href="/gear"
                            className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 text-xs transition-all"
                        >
                            <Compass className="h-4 w-4" />
                            Browse Gear Now
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="py-3 px-4 rounded-l-xl">Equipment</th>
                                    <th className="py-3 px-4">Rental Duration</th>
                                    <th className="py-3 px-4">Total Price</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {recentOrders.map((order: TRentalOrder, idx: number) => {
                                    const gearName = order.gearItem?.name || order.gear?.name || "Rental Equipment";
                                    const gearBrand = order.gearItem?.brand || order.gear?.brand || "";
                                    const price = Number(order.totalPrice) || 0;
                                    const isApproved = (order.rentalOrderStatus || "").toUpperCase() === "APPROVED";

                                    return (
                                        <tr key={order._id || order.id || idx} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-white">
                                                <div>{gearName}</div>
                                                {gearBrand && (
                                                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                                        <Tag className="h-2.5 w-2.5" />
                                                        {gearBrand}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                                                {order.startDate?.slice(0, 10)} to {order.endDate?.slice(0, 10)}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-teal-400">
                                                ${price.toFixed(2)}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {getStatusBadge(order.rentalOrderStatus)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                {isApproved ? (
                                                    <Link
                                                        href="/dashboard/customer/orders"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                                                    >
                                                        <CreditCard className="h-3.5 w-3.5" />
                                                        Pay Now
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href="/dashboard/customer/orders"
                                                        className="text-xs text-slate-400 hover:text-white underline"
                                                    >
                                                        Details
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboardPage;