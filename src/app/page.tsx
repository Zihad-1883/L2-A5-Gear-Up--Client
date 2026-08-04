import HeroBanner from "@/components/landingPage/HeroBanner";
import AboutSection from "@/components/landingPage/AboutSection";
import HowItWorks from "@/components/landingPage/HowItWorks";
import FeaturedGears from "@/components/landingPage/FeaturedGears";
import Testimonials from "@/components/landingPage/Testimonials";
import FAQSection from "@/components/landingPage/FAQSection";
import CTASection from "@/components/landingPage/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <HeroBanner />
      <AboutSection />
      <HowItWorks />
      <FeaturedGears />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </div>
  );
}
