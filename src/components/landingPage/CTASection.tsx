import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 py-24 border-t border-slate-800">
            <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-teal-500/15 blur-[140px]" />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30 mb-6">
                    <ShieldCheck className="h-7 w-7" />
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                    Ready to Gear Up for Your Next Journey?
                </h2>
                <p className="mt-4 text-base text-slate-300 sm:text-lg max-w-2xl mx-auto leading-relaxed">
                    Join thousands of adventurers, campers, and sports lovers who rent and host gear with confidence on GearUp today.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="w-full sm:w-auto text-base font-semibold px-8 shadow-xl shadow-teal-500/20">
                        <Link href="/register" className="flex items-center gap-2">
                            Create Free Account
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base border-slate-700 text-slate-200 hover:border-slate-600 hover:bg-slate-800">
                        <Link href="/login">
                            Sign In
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
