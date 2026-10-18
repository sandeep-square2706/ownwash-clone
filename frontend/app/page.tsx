import AddOns from "@/components/home/AddOns";
import BookAffordable from "@/components/home/BookAffordable";
import CleanKartPromise from "@/components/home/CleanKartPromise";
import FranchiseCTA from "@/components/home/FranchiseCTA";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import LatestBlog from "@/components/home/LatestBlog";
import Pricing from "@/components/home/Pricing";
import ServiceHighlights from "@/components/home/ServiceHighlights";
import Testimonials from "@/components/home/Testimonials";
import TopServices from "@/components/home/TopServices";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <main>
      <Hero />

      <TopServices />

      <AddOns />

      <CleanKartPromise />

      <ServiceHighlights />

      <HowItWorks />

      <BookAffordable />

      <FranchiseCTA />

      <WhyChooseUs />

      <Pricing />

      <Testimonials />

      <LatestBlog />
    </main>
  );
}
