import Header from "@/components/landingpage/Header";
import Hero from "@/components/landingpage/Hero";
import Features from "@/components/landingpage/Features";
import HowItWorks from "@/components/landingpage/HowItWorks";
import Testimonials from "@/components/landingpage/Testimonials";
import CTA from "@/components/landingpage/CTA";
import Footer from "@/components/landingpage/Footer";
import { getCurrentUser } from "./lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  // const user = await getCurrentUser();

  // if (user?.role === "staff") {
  //   redirect("/staffdashboard");
  // } else if (user?.role === "hr") {
  //   redirect("/hrdashboard");
  // } else if (user?.role === "cc") {
  //   redirect("/ccdashboard");
  // } else if (user?.role === "bi") {
  //   redirect("/bidashboard");
  // }
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
