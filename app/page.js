import Header from "@/components/landingpage/Header";
import Hero from "@/components/landingpage/Hero";
import Features from "@/components/landingpage/Features";
import HowItWorks from "@/components/landingpage/HowItWorks";
import Testimonials from "@/components/landingpage/Testimonials";
import CTA from "@/components/landingpage/CTA";
import Footer from "@/components/landingpage/Footer";

export default function Home({}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
