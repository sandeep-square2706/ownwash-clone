import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking and payment preview",
  description: "Enter service details and review a CleanKart booking and payment preview.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
