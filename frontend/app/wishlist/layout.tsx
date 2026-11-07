import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your wishlist",
  description: "View the Zaapino services saved in your browser.",
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
