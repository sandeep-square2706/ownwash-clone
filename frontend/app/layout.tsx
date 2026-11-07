import type { Metadata } from "next";
import "./globals.css";


import SiteChrome from "@/components/layout/SiteChrome";
import { getSiteUrl } from "@/lib/site-url";

import WhatsAppButton from "@/components/WhatsAppButton";

const siteUrl = getSiteUrl();
const logoUrl = siteUrl
  ? new URL("/images/logo/zaapino-logo-transparent.png", siteUrl).toString()
  : undefined;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Zaapino | Home, Car & Office Cleaning Services",
    template: "%s | Zaapino",
  },
  description:
    "Book trusted doorstep cleaning for your car, home and everyday spaces.",
  applicationName: "Zaapino",
  icons: {
    icon: "/images/logo/zaapino-logo-transparent.png",
    shortcut: "/images/logo/zaapino-logo-transparent.png",
    apple: "/images/logo/zaapino-logo-transparent.png",
  },
  openGraph: {
    type: "website",
    siteName: "Zaapino",
    title: "Zaapino | Home, Car & Office Cleaning Services",
    description:
      "Book trusted doorstep cleaning for your car, home and everyday spaces.",
    locale: "en_IN",
    ...(logoUrl
      ? {
          images: [
            {
              url: logoUrl,
              width: 768,
              height: 768,
              alt: "Zaapino logo",
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary",
    title: "Zaapino | Home, Car & Office Cleaning Services",
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
