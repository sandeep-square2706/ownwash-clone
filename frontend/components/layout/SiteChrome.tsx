"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

function SiteChromeContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCheckout = pathname === "/checkout";
  const isPartnerPortal = pathname === "/partner" || pathname.startsWith("/partner/");

  // Partner pages have their own responsive navigation and should not
  // render the customer's header/footer a second time.
  if (isCheckout || isPartnerPortal) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <SiteChromeContent>{children}</SiteChromeContent>
    </Suspense>
  );
}
