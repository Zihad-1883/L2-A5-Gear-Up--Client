import { Skeleton } from "@/components/ui/skeleton";

export default function GearCatalogLoading() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Banner Skeleton */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4">
                    <Skeleton className="h-6 w-44 rounded-full" />
                    <Skeleton className="h-10 w-96 rounded-xl" />
                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                </div>

                {/* Filter bar Skeleton */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <Skeleton className="h-11 flex-1 w-full rounded-xl" />
                        <Skeleton className="h-11 w-full md:w-48 rounded-xl" />
                        <Skeleton className="h-11 w-full md:w-48 rounded-xl" />
                        <Skeleton className="h-11 w-full md:w-44 rounded-xl" />
                    </div>
                </div>

                {/* Showing status bar Skeleton */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
                    <Skeleton className="h-4 w-48 rounded" />
                </div>

                {/* 4-Column Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4 shadow-lg"
                        >
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20 rounded" />
                                <Skeleton className="h-5 w-3/4 rounded-lg" />
                                <Skeleton className="h-3 w-full rounded" />
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                                <Skeleton className="h-6 w-20 rounded-lg" />
                                <Skeleton className="h-9 w-24 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
