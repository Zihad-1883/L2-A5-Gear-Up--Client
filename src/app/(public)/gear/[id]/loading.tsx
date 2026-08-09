import { Skeleton } from "@/components/ui/skeleton";

export default function GearDetailsLoading() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Back button skeleton */}
                <Skeleton className="h-6 w-32 rounded-lg" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Image & Info */}
                    <div className="lg:col-span-7 space-y-6">
                        <Skeleton className="h-96 w-full rounded-3xl" />
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-3/4 rounded-xl" />
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-5/6 rounded" />
                        </div>
                    </div>

                    {/* Right: Booking widget skeleton */}
                    <div className="lg:col-span-5">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-2xl">
                            <Skeleton className="h-8 w-40 rounded-xl" />
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-10 w-full rounded-xl" />
                            </div>
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
