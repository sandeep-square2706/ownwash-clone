import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Zaapino",
  description: "Contact Zaapino about home, car and office cleaning services.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
