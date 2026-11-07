import { ProtectedAdmin } from "@/components/ProtectedAdmin";
import { AdminShell } from "@/components/AdminShell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedAdmin><AdminShell>{children}</AdminShell></ProtectedAdmin>;
}
