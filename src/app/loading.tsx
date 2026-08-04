import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4 px-4 text-center">
            <div className="relative flex items-center justify-center">
                <div className="absolute h-16 w-16 rounded-full border-4 border-teal-500/20 animate-ping" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 shadow-xl backdrop-blur-md">
                    <Loader2 className="h-7 w-7 animate-spin text-teal-400" />
                </div>
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white tracking-wide">
                    Loading GearUp...
                </h3>
            </div>
        </div>
    );
}
