import type { Metadata } from "next";
import "./globals.css";


import SiteChrome from "@/components/layout/SiteChrome";
import { getSiteUrl } from "@/lib/site-url";

import WhatsAppButton from "@/components/WhatsAppButton";

const siteUrl = getSiteUrl();
const logoUrl = siteUrl
  ? new URL("/images/logo/cleankart-logo.png", siteUrl).toString()
  : undefined;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "CleanKart | Doorstep Cleaning Services",
    template: "%s | CleanKart",
  },
  description:
    "Book trusted doorstep cleaning for your car, home and everyday spaces.",
  applicationName: "CleanKart",
  icons: {
    icon: "/images/logo/cleankart-logo.png",
    shortcut: "/images/logo/cleankart-logo.png",
    apple: "/images/logo/cleankart-logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "CleanKart",
    title: "CleanKart | Doorstep Cleaning Services",
    description:
      "Book trusted doorstep cleaning for your car, home and everyday spaces.",
    locale: "en_IN",
    ...(logoUrl
      ? {
          images: [
            {
              url: logoUrl,
              width: 1024,
              height: 1024,
              alt: "CleanKart logo",
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary",
    title: "CleanKart | Doorstep Cleaning Services",
    description:
      "Book trusted doorstep cleaning for your car, home and everyday spaces.",
    ...(logoUrl ? { images: [logoUrl] } : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
        <WhatsAppButton />
      </body>
    </html>
  );
}
