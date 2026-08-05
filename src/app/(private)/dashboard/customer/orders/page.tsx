import { getMyRentalOrders } from "@/lib/actions/customerActions";
import CustomerOrdersTable from "@/components/dashboard/CustomerOrdersTable";
import { TRentalOrder } from "@/app/types/rental";
import { ShoppingBag, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const CustomerOrdersPage = async () => {
    const res = await getMyRentalOrders();
    const orders: TRentalOrder[] = Array.isArray(res)
        ? res
        : res?.data || res?.result || [];

    return (
        <div className="space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Customer Dashboard</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <ShoppingBag className="h-7 w-7 text-teal-400" />
                        My Rental Orders
                    </h1>
                    <p className="text-sm text-slate-400 max-w-xl">
                        Track your equipment rental requests, order approval status, and complete online payments.
                    </p>
                </div>
            </div>

            {/* Orders Table */}
            <CustomerOrdersTable initialOrders={orders} />
        </div>
    );
};

export default CustomerOrdersPage;