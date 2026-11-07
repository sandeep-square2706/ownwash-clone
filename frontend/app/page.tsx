
import { Suspense } from "react";

import AddOns from "@/components/home/AddOns";
import BookAffordable from "@/components/home/BookAffordable";
import CleanKartPromise from "@/components/home/CleanKartPromise";
import Hero from "@/components/home/Hero";
import FirstOrderOfferBanner from "@/components/home/FirstOrderOfferBanner";
import HomeStats from "@/components/home/HomeStats";
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
      <FirstOrderOfferBanner />

      <Suspense fallback={<div className="min-h-[440px]" />}>
        <Hero />
      </Suspense>

      <HomeStats />

      <TopServices />

      <AddOns />

      <CleanKartPromise />

      <ServiceHighlights />

      <HowItWorks />

      <BookAffordable />


      <WhyChooseUs />

      <Suspense fallback={<div className="min-h-[300px]" />}>
        <Pricing />
      </Suspense>

      <Testimonials />

      <LatestBlog />
    </main>
  );
}
