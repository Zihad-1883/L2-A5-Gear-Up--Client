import { Search, CalendarCheck, MapPin, Smile } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Discover Gear",
            description: "Browse curated categories of sports & outdoor equipment near your destination or city.",
            icon: Search,
        },
        {
            number: "02",
            title: "Book & Request",
            description: "Choose your dates, select optional insurance, and send an instant booking request.",
            icon: CalendarCheck,
        },
        {
            number: "03",
            title: "Pickup or Delivery",
            description: "Meet the verified host locally or have the gear delivered directly to your campsite.",
            icon: MapPin,
        },
        {
            number: "04",
            title: "Enjoy & Return",
            description: "Conquer your adventure and return the gear easily at your scheduled end time.",
            icon: Smile,
        },
    ];

    return (
        <section className="bg-slate-950 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="text-center">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                        Simple Step-by-Step
                    </h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        How GearUp Works
                    </p>
                    <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
                        Renting or hosting outdoor gear has never been smoother. Follow four quick steps to start your next journey.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={idx}
                                className="relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-all hover:border-teal-500/50 hover:bg-slate-900/90"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-3xl font-black text-slate-700/60 select-none">
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className="mt-6 text-lg font-bold text-white">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
