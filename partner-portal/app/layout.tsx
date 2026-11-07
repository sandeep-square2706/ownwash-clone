import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zaapino Partner Portal",
  description:
    "Manage your Zaapino partner profile, bookings, availability, and earnings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
