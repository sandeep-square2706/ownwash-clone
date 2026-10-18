import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact CleanKart",
  description: "Contact CleanKart about home, car and office cleaning services.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
