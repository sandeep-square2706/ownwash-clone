import type { Metadata } from "next";
import "./partner.css";

export const metadata: Metadata = {
  title: "Zaapino Partner Portal",
  description: "Register and manage your Zaapino cleaning partner account, bookings, availability and earnings.",
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
