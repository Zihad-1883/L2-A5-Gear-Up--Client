"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const faqs = [
        {
            question: "How does identity verification work on GearUp?",
            answer: "Every user must complete a swift ID verification check before renting or hosting gear. This ensures that all community members are accountable and authentic.",
        },
        {
            question: "What happens if gear is damaged during a rental?",
            answer: "All rentals on GearUp are covered by our Gear Security Guarantee. Hosts can submit damage claims directly within 48 hours of return, backed by security deposits.",
        },
        {
            question: "How do payouts work for Gear Hosts?",
            answer: "Payouts are automatically released to your linked bank account or preferred payment method within 24 hours of successful pickup by the renter.",
        },
        {
            question: "Can I extend my rental duration mid-trip?",
            answer: "Yes! If the host hasn't booked the item for another renter, you can request a seamless extension directly through your active bookings dashboard.",
        },
        {
            question: "Is there a minimum or maximum rental duration?",
            answer: "Hosts set their own minimum rental period (typically 1 day). Maximum rental periods can be negotiated for long expedition trips.",
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenIdx(openIdx === index ? null : index);
    };

    return (
        <section className="bg-slate-900/60 py-24 border-t border-slate-800">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-400">
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>Got Questions?</span>
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-3 text-slate-400 text-sm sm:text-base">
                        Everything you need to know about renting & hosting gear on GearUp.
                    </p>
                </div>

                {/* FAQ Accordion List */}
                <div className="mt-12 space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div
                                key={idx}
                                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md transition-all"
                            >
                                <button
                                    onClick={() => toggleFAQ(idx)}
                                    className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <span className="text-base font-bold text-white sm:text-lg">
                                        {faq.question}
                                    </span>
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-teal-400" : ""}`}>
                                        <ChevronDown className="h-5 w-5" />
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="px-6 pb-6 pt-2 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
