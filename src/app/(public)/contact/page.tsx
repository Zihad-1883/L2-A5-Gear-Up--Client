import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">

        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="default" showDot={true}>
            Contact Us
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            We&apos;d Love to <span className="text-teal-400">Hear</span> From You
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Have a question about gear rentals, provider registration, or payments? Send us a message and our support team will respond promptly.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Information Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="bg-slate-900/90 border-slate-800 p-6 space-y-6">
              <h3 className="text-lg font-bold text-white">Contact Info</h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Email Us</p>
                    <p className="text-xs text-slate-400">support@gearup.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Call Support</p>
                    <p className="text-xs text-slate-400">+880 1700-000000</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Headquarters</p>
                    <p className="text-xs text-slate-400">Dhaka, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Support Hours</p>
                    <p className="text-xs text-slate-400">Mon - Sat: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/90 border-slate-800 p-6 sm:p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-white">Send a Message</CardTitle>
                <CardDescription className="text-slate-400">
                  Fill out the form below and we will get back to you within 24 hours.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 pb-0 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                    <Input placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Email Address</label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Subject</label>
                  <Input placeholder="Rental Inquiry / Feedback" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Message</label>
                  <textarea
                    rows={4}
                    className="flex w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50"
                    placeholder="How can we help you today?"
                  />
                </div>

                <Button variant="default" size="lg" className="w-full sm:w-auto">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}
