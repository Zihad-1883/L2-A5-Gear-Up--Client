import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center space-y-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl backdrop-blur-md">
        <Compass className="h-10 w-10 text-teal-400 animate-pulse" />
      </div>

      <div className="max-w-md space-y-2">
        <span className="inline-block rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-400">
          404 Error
        </span>
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-400">
          The page or equipment listing you are looking for does not exist, has been removed, or moved to another URL.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild variant="default" size="lg">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
