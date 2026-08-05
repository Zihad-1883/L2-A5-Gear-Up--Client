import { getProviderOrders, getProviderGears } from "@/lib/actions/providerActions";
import { cookies } from "next/headers";
import { verifyToken } from "@/utilis/jwt";
import Link from "next/link";
import {
    Package,
    ShoppingBag,
    Clock,
    DollarSign,
    PlusCircle,
    ArrowRight,
    Sparkles,
    Calendar,
    CheckCircle2,
    Truck,
    Layers,
    ChevronRight,
    User,
} from "lucide-react";
import { TRentalOrder } from "@/app/types/rental";
import { TGear } from "@/app/types/gear";

export const dynamic = "force-dynamic";

const ProviderDashboardPage = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const verifiedToken = accessToken
        ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!)
        : null;
    const currentUser = verifiedToken?.success && verifiedToken.data ? verifiedToken.data : null;

    const [ordersRes, gearsRes] = await Promise.all([
        getProviderOrders(),
        getProviderGears(),
    ]);

    const orders: TRentalOrder[] = Array.isArray(ordersRes)
        ? ordersRes
        : ordersRes?.data || ordersRes?.result || [];

    const gears: TGear[] = Array.isArray(gearsRes)
        ? gearsRes
        : gearsRes?.data || gearsRes?.result || [];

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
        (o) => (o.rentalOrderStatus || "PENDING").toUpperCase() === "PENDING"
    ).length;
    const activeRentals = orders.filter(
        (o) => (o.rentalOrderStatus || "").toUpperCase() === "PICKED_UP"
    ).length;

    const totalRevenue = orders
        .filter((o) => {
            const st = (o.rentalOrderStatus || "").toUpperCase();
            return st === "APPROVED" || st === "PICKED_UP" || st === "RETURNED";
        })
        .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

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
                        Approved
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
                        <CheckCircle2 className="h-3 w-3" />
                        Returned
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
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Equipment Provider Portal</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                            Welcome back,{" "}
                            <span className="bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                                {currentUser?.name || "Provider"}
                            </span>
                        </h1>
                        <p className="text-sm text-slate-400 max-w-xl">
                            Manage your listed gear items, approve customer rental requests, and track total rental earnings in real time.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/60 border border-slate-800/80 px-4 py-2.5 rounded-2xl">
                            <Calendar className="h-4 w-4 text-teal-400" />
                            <span>{currentDate}</span>
                        </div>
                        <Link
                            href="/dashboard/provider/create-gears"
                            className="inline-flex items-center gap-2 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 text-xs shadow-lg shadow-teal-500/20 transition-all"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Add New Gear
                        </Link>
                    </div>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Gear Listed */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-teal-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Listed Gears</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            <Package className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-white">{gears.length}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-teal-400">
                        <Link href="/dashboard/provider/my-all-gears" className="hover:underline flex items-center gap-1">
                            View inventory <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-blue-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Total Rental Orders</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <ShoppingBag className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-white">{totalOrders}</p>
                    <div className="mt-2 text-xs text-slate-400">
                        <span className="text-blue-400 font-semibold">{activeRentals} currently rented out</span>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-amber-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Pending Requests</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-white">{pendingOrders}</p>
                    <div className="mt-2 text-xs text-amber-400">
                        {pendingOrders > 0 ? "Requires provider approval" : "All requests handled"}
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Est. Rental Revenue</span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-emerald-400">
                        ${totalRevenue.toFixed(2)}
                    </p>
                    <div className="mt-2 text-xs text-slate-400">
                        From approved & active rentals
                    </div>
                </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/dashboard/provider/create-gears"
                    className="group flex items-center justify-between p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-teal-500/30 transition-all"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                            <PlusCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">List New Equipment</h3>
                            <p className="text-xs text-slate-400">Add camera, audio, or lighting gear</p>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                    href="/dashboard/provider/orders"
                    className="group flex items-center justify-between p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-blue-500/30 transition-all"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">Manage Rental Orders</h3>
                            <p className="text-xs text-slate-400">Approve, reject, & track gear delivery</p>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                    href="/dashboard/provider/my-all-gears"
                    className="group flex items-center justify-between p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-purple-500/30 transition-all"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Gear Inventory</h3>
                            <p className="text-xs text-slate-400">Edit prices, availability, & listings</p>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>

            {/* Recent Orders Preview */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-white">Recent Customer Requests</h2>
                        <p className="text-xs text-slate-400">Latest incoming gear rental orders requiring management</p>
                    </div>
                    <Link
                        href="/dashboard/provider/orders"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                    >
                        View All Orders <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 space-y-3">
                        <ShoppingBag className="h-10 w-10 text-slate-600 mx-auto" />
                        <p className="text-sm font-medium text-slate-400">No rental requests received yet.</p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            When customers request to rent your listed gear, their orders will show up here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="py-3 px-4 rounded-l-xl">Equipment</th>
                                    <th className="py-3 px-4">Customer</th>
                                    <th className="py-3 px-4">Rental Duration</th>
                                    <th className="py-3 px-4">Total Amount</th>
                                    <th className="py-3 px-4 rounded-r-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {recentOrders.map((order, idx) => {
                                    const gearName = order.gearItem?.name || order.gear?.name || "Rental Equipment";
                                    const gearBrand = order.gearItem?.brand || order.gear?.brand || "";
                                    const customerName = order.customer?.name || order.user?.name || "Customer";
                                    const customerEmail = order.customer?.email || order.user?.email || "";
                                    const price = Number(order.totalPrice) || 0;

                                    return (
                                        <tr key={order._id || order.id || idx} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-white">
                                                <div>{gearName}</div>
                                                {gearBrand && <div className="text-[10px] text-slate-500">{gearBrand}</div>}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-300">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-3.5 w-3.5 text-slate-500" />
                                                    <span>{customerName}</span>
                                                </div>
                                                {customerEmail && (
                                                    <div className="text-[10px] text-slate-500 pl-5">{customerEmail}</div>
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

export default ProviderDashboardPage;