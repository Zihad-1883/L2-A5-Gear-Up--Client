import { Shield, Zap, HeartHandshake, Leaf } from "lucide-react";

export default function AboutSection() {
    return (
        <section className="relative bg-slate-900/60 py-20 border-y border-slate-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                        About GearUp
                    </h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Rethinking How You Experience Adventure
                    </p>
                    <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
                        GearUp is a peer-to-peer sports and outdoor gear rental marketplace. We empower outdoor enthusiasts to access world-class equipment without expensive upfront costs, while enabling gear owners to monetize their unused gear safely.
                    </p>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md transition-all hover:border-teal-500/40 hover:-translate-y-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="mt-5 text-lg font-bold text-white">Instant Accessibility</h3>
                        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                            Rent top-brand kayaks, tents, skis, and bikes near you in minutes with transparent daily rates.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md transition-all hover:border-teal-500/40 hover:-translate-y-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h3 className="mt-5 text-lg font-bold text-white">Verified Security</h3>
                        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                            Every user is identity-verified and items are protected by comprehensive damage guarantee policies.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md transition-all hover:border-teal-500/40 hover:-translate-y-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            <Leaf className="h-6 w-6" />
                        </div>
                        <h3 className="mt-5 text-lg font-bold text-white">Eco-Friendly Sharing</h3>
                        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                            Reduce manufacturing waste and environmental footprint by sharing existing high-performance gear.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md transition-all hover:border-teal-500/40 hover:-translate-y-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                            <HeartHandshake className="h-6 w-6" />
                        </div>
                        <h3 className="mt-5 text-lg font-bold text-white">Community Driven</h3>
                        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                            Connect with trusted local experts, get regional advice, and support local adventure culture.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
