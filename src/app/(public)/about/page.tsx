import { Shield, Award, Users, RefreshCw, Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16">

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="default" showDot={true}>
            About GearUp
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
            Empowering Every <span className="text-teal-400">Adventure</span> & Sport
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            GearUp is Bangladesh’s premier peer-to-peer sports and outdoor equipment rental platform. We make top-tier equipment accessible, affordable, and sustainable for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="text-center p-6 bg-slate-900/90 border-slate-800">
            <h3 className="text-3xl font-extrabold text-teal-400">5,000+</h3>
            <p className="text-sm text-slate-400 mt-1">Successful Rentals</p>
          </Card>
          <Card className="text-center p-6 bg-slate-900/90 border-slate-800">
            <h3 className="text-3xl font-extrabold text-teal-400">1,200+</h3>
            <p className="text-sm text-slate-400 mt-1">Verified Gear Listed</p>
          </Card>
          <Card className="text-center p-6 bg-slate-900/90 border-slate-800">
            <h3 className="text-3xl font-extrabold text-teal-400">4.9 ★</h3>
            <p className="text-sm text-slate-400 mt-1">Customer Satisfaction</p>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Why GearUp?</h2>
            <p className="text-sm text-slate-400">Built for outdoor enthusiasts, athletes, and casual players alike.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/90 border-slate-800">
              <CardHeader className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Shield className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-white">Verified Equipment</CardTitle>
                <CardDescription className="text-slate-400">
                  Every listed gear undergoes safety inspection and quality checks before being approved for rentals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/90 border-slate-800">
              <CardHeader className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-white">Flexible Rental Periods</CardTitle>
                <CardDescription className="text-slate-400">
                  Rent by the day or week. Pick up and return with ease according to your adventure schedule.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/90 border-slate-800">
              <CardHeader className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Users className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-white">Community Driven</CardTitle>
                <CardDescription className="text-slate-400">
                  Connect equipment owners with sports lovers, creating a sustainable sharing economy for gear.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/30 border-slate-800 p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to gear up for your next trip?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Explore hundreds of verified camping, hiking, cricket, cycling, and fitness gear available today.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" variant="default">
              <Link href="/gear" className="flex items-center gap-2">
                Browse Equipment Catalog <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
