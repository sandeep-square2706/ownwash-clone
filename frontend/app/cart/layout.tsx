import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your selected Zaapino services and preview the estimated total.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
