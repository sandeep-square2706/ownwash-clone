import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your CleanKart account",
  description: "Manage CleanKart bookings, saved services and profile details when account access is connected.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
