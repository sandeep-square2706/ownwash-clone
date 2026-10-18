import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cleaning services",
  description: "Explore CleanKart home, car and everyday cleaning services with preview pricing and service options.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
