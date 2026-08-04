import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-800 bg-slate-900 text-slate-400">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">

                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20">
                                <Shield className="h-5 w-5 stroke-[2.5]" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-white">
                                Gear<span className="text-teal-400">Up</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Your ultimate platform for premium sports and outdoor gear rentals. Rent top-quality equipment for your next adventure.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/gear" className="hover:text-teal-400 transition-colors">
                                    Browse Gears
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-teal-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-teal-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-teal-400 transition-colors">
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Support & Policies
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:text-teal-400 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-teal-400 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-teal-400 transition-colors">
                                    Rental Agreement
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-teal-400 transition-colors">
                                    Safety Guide
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Get In Touch
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                                <span>support@gearup.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-teal-400 shrink-0" />
                                <span>+880 1700-000000</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-teal-400 shrink-0" />
                                <span>Dhaka, Bangladesh</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
                    <p>© {new Date().getFullYear()} GearUp. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-slate-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-slate-400 transition-colors">
                            Terms of Use
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}