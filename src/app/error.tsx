"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Unhandled Application Error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[75vh] flex-col items-center justify-center space-y-6 px-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/10 shadow-2xl backdrop-blur-md">
                <AlertTriangle className="h-10 w-10 text-rose-400" />
            </div>

            <div className="max-w-md space-y-2">
                <span className="inline-block rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-400">
                    Application Error
                </span>
                <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                    Something went wrong!
                </h1>
                <p className="text-sm text-slate-400">
                    An unexpected error occurred while rendering this page. You can try refreshing or returning to the homepage.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button onClick={() => reset()} variant="default" size="lg">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
                <Button asChild variant="secondary" size="lg">
                    <Link href="/" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Go to Homepage
                    </Link>
                </Button>
            </div>
        </div>
    );
}
