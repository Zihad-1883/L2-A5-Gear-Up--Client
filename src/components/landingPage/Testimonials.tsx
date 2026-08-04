import { Star, Quote, CheckCircle2 } from "lucide-react";

export default function Testimonials() {
    const reviews = [
        {
            name: "Marcus Vance",
            role: "Outdoor Enthusiast",
            type: "Renter",
            content: "Rented a 4-person expedition tent and trekking poles for a weekend trip to Yosemite. The gear was in brand new condition, and the owner was incredibly helpful!",
            rating: 5,
            initials: "MV",
        },
        {
            name: "Sarah Jenkins",
            role: "Kayak Host & Guide",
            type: "Gear Host",
            content: "GearUp made it effortless for me to list my tandem kayaks when I'm not using them. The insurance protection gives me complete peace of mind, and the payouts are instant.",
            rating: 5,
            initials: "SJ",
        },
        {
            name: "David Chen",
            role: "Mountain Biker",
            type: "Renter",
            content: "Saved over $1,200 on my Utah bike trip by renting a full-suspension MTB on GearUp instead of buying or flying with my heavy bike. Flawless experience!",
            rating: 5,
            initials: "DC",
        },
    ];

    return (
        <section className="bg-slate-950 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="text-center">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                        Community Reviews
                    </h2>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Trusted by Adventurers Worldwide
                    </p>
                    <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
                        See how GearUp connects outdoor explorers with top-tier gear hosts across the country.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-sm transition-all hover:border-teal-500/40 hover:bg-slate-900/90"
                        >
                            <Quote className="absolute top-6 right-6 h-8 w-8 text-slate-800/80" />

                            <div>

                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                                    ))}
                                </div>

                                <p className="mt-5 text-sm text-slate-300 leading-relaxed italic">
                                    &ldquo;{review.content}&rdquo;
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-800/60">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20 font-bold text-teal-400 border border-teal-500/30">
                                    {review.initials}
                                </div>

                                <div>
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                                        {review.name}
                                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span>{review.role}</span>
                                        <span>•</span>
                                        <span className="text-teal-400 font-medium">{review.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
