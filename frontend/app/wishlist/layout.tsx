import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your wishlist",
  description: "View the CleanKart services saved in your browser.",
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
