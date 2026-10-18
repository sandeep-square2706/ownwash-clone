import type { Metadata } from "next";
import "./globals.css";

import SiteChrome from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  title: "CleanKart | Doorstep Cleaning Services",
  description:
    "Book trusted doorstep cleaning for your car, home and everyday spaces.",
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
      </body>
    </html>
  );
}
