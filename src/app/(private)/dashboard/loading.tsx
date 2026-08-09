import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-8 w-64 rounded-xl" />
                <Skeleton className="h-4 w-96 rounded-lg" />
            </div>

            {/* Stat Cards Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-9 w-9 rounded-xl" />
                        </div>
                        <Skeleton className="h-8 w-16 rounded-lg" />
                        <Skeleton className="h-3 w-32 rounded" />
                    </div>
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <Skeleton className="h-6 w-48 rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-xl" />
                </div>
                <div className="space-y-3 pt-2">
                    {[1, 2, 3, 4, 5].map((row) => (
                        <div key={row} className="flex items-center justify-between gap-4 py-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-40 rounded" />
                                    <Skeleton className="h-3 w-24 rounded" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-4 w-20 rounded" />
                            <Skeleton className="h-8 w-20 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
