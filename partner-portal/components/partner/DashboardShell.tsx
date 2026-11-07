"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearPartnerSession, partnerApi, partnerMediaUrl } from "../../lib/partner/api";
import { PartnerLogo, StatusPill } from "./PartnerUI";
import { customerSiteUrl } from "../../lib/partner/urls";

type PartnerProfile = {
  display_name?: string;
  legal_name?: string;
  profile_photo?: string | null;
  status?: string;
  billing_blocked?: boolean;
};

const links = [
  ["/partner/dashboard", "Dashboard", "⌂"],
  ["/partner/bookings", "My bookings", "▣"],
  ["/partner/availability", "Availability", "◷"],
  ["/partner/services", "Services & areas", "✦"],
  ["/partner/documents", "Documents", "▤"],
  ["/partner/earnings", "Earnings", "₹"],
  ["/partner/billing", "Billing & invoices", "▤"],
  ["/partner/payouts", "Payouts", "⇧"],
  ["/partner/reviews", "Ratings & reviews", "★"],
  ["/partner/support", "Help & support", "?"],
  ["/partner/notifications", "Notifications", "♢"],
  ["/partner/profile", "My profile", "◉"],
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("cleankart_partner_access_token")) {
      router.replace("/partner/login");
      return;
    }
    const loadProfile = () => {
      partnerApi<PartnerProfile>("/partners/me/")
        .then((data) => { if (mounted) setProfile(data); })
        .catch(() => {
          if (!mounted) return;
          clearPartnerSession();
          router.replace("/partner/login");
        })
        .finally(() => { if (mounted) setReady(true); });
    };
    window.addEventListener("partner-profile-updated", loadProfile);
    loadProfile();
    return () => {
      mounted = false;
      window.removeEventListener("partner-profile-updated", loadProfile);
    };
  }, [router]);

  function logout() {
    clearPartnerSession();
    router.replace("/partner/login");
  }

  if (!ready) return <div className="cp-loading"><span className="cp-spinner" />Checking partner account…</div>;

  return (
    <div className="cp-app-shell">
      <aside className="cp-sidebar">
        <PartnerLogo />
        <div className="cp-sidebar-caption">WORKSPACE</div>
        <nav className="cp-side-nav" aria-label="Partner portal navigation">
          {links.map(([href, label, icon]) => (
            <Link key={href} href={href} className={pathname === href || (href !== "/partner/dashboard" && pathname.startsWith(`${href}/`)) ? "active" : ""}>
              <span className="cp-nav-icon">{icon}</span>{label}
            </Link>
          ))}
        </nav>
        <div className="cp-sidebar-bottom">{customerSiteUrl ? <a href={customerSiteUrl}>← Back to customer website</a> : null}</div>
      </aside>
      <div className="cp-workspace">
        <header className="cp-topbar">
          <button className="cp-mobile-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">☰</button>
          <div><strong>Partner workspace</strong><span>Manage your Zaapino work</span></div>
          <div className="cp-topbar-right">
            {profile?.status ? <StatusPill value={profile.status} /> : null}
            <div
              className="cp-avatar"
              style={{ position: "relative", overflow: "hidden" }}
              aria-label={`${profile?.display_name || profile?.legal_name || "Partner"} profile photo`}
            >
              {profile?.profile_photo ? (
                <img
                  src={partnerMediaUrl(profile.profile_photo)}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                (profile?.display_name || profile?.legal_name || "P").slice(0, 1).toUpperCase()
              )}
            </div>
            <span className="cp-user-name">{profile?.display_name || profile?.legal_name || "Cleaning Partner"}</span>
            <button className="cp-logout" onClick={logout}>Log out</button>
          </div>
        </header>
        {menuOpen ? <nav className="cp-mobile-nav">{links.map(([href,label])=><Link key={href} href={href} onClick={()=>setMenuOpen(false)}>{label}</Link>)}{customerSiteUrl ? <a href={customerSiteUrl}>Customer website</a> : null}</nav> : null}
        {profile?.billing_blocked ? <div className="cp-billing-warning" role="alert">Your partner access is blocked because an invoice is overdue. <Link href="/partner/billing">View and resolve billing →</Link></div> : null}
        <main className="cp-content">{children}</main>
      </div>
    </div>
  );
}
