import Header from "@/components/landingpage/Header";
import Hero from "@/components/landingpage/Hero";
import Features from "@/components/landingpage/Features";
import HowItWorks from "@/components/landingpage/HowItWorks";
import CTA from "@/components/landingpage/CTA";
import Footer from "@/components/landingpage/Footer";

export default async function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center overflow-x-hidden">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
