import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner interest",
  description: "Share a CleanKart local service or franchise partnership enquiry.",
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
