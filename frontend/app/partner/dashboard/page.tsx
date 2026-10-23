import DashboardShell from "../../../components/partner/DashboardShell";
import PartnerSection from "../../../components/partner/PartnerSection";
import {
  BriefcaseBusiness,
  CalendarCheck,
  CircleDollarSign,
  ClipboardCheck,
  Headphones,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const stats = [
  {
    label: "Application",
    value: "Status review",
    description: "Track your CleanKart partner application.",
    icon: ClipboardCheck,
    href: "#",
  },
  {
    label: "Bookings",
    value: "No live data yet",
    description: "Your assigned cleaning bookings will appear here.",
    icon: CalendarCheck,
    href: "#",
  },
  {
    label: "Completed jobs",
    value: "No live data yet",
    description: "Completed services and job history.",
    icon: BriefcaseBusiness,
    href: "#",
  },
  {
    label: "Today's earnings",
    value: "Connect earnings API",
    description: "View your daily service earnings.",
    icon: CircleDollarSign,
    href: "#",
  },
  {
    label: "Pending payout",
    value: "Connect payout API",
    description: "Track upcoming partner payouts.",
    icon: CircleDollarSign,
    href: "#",
  },
  {
    label: "Rating",
    value: "No reviews yet",
    description: "Your customer ratings will appear here.",
    icon: Star,
    href: "#",
  },
];

export default function Page() {
  return (
    <DashboardShell>
      <PartnerSection
        title="Partner Dashboard"
        description="Your application, bookings and earnings at a glance."
      >
        <div className="space-y-7">

          {/* HERO */}
          <section className="relative overflow-hidden rounded-[26px] bg-[var(--brand-navy)] px-6 py-8 text-white shadow-[0_18px_45px_rgba(16,44,95,0.18)] sm:px-8 sm:py-10">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[var(--brand-gold)]/10 blur-3xl" />

            <div className="relative max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
                <Sparkles className="h-4 w-4" />
                CleanKart Partner
              </div>

              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                Welcome to your partner dashboard 👋
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Manage your cleaning services, bookings, earnings and customer
                reviews from one place.
              </p>
            </div>
          </section>

          {/* QUICK STATS */}
          <section>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-[var(--brand-navy)]">
                Your overview
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Everything you need to manage your CleanKart partnership.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stats.map(
                ({
                  label,
                  value,
                  description,
                  icon: Icon,
                  href,
                }) => (
                  <article
                    key={label}
                    className="group flex min-h-[190px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_35px_rgba(37,99,235,0.10)]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[var(--brand-blue)] transition group-hover:bg-blue-600 group-hover:text-white">
                        <Icon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>

                      {label === "Rating" && (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                          Reviews
                        </span>
                      )}
                    </div>

                    <h4 className="mt-5 text-lg font-bold text-[var(--brand-navy)]">
                      {label}
                    </h4>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {value}
                    </p>

                    <p className="mt-2 flex-1 text-sm leading-5 text-slate-500">
                      {description}
                    </p>

                    <a
                      href={href}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand-blue)] transition group-hover:gap-2.5"
                    >
                      Open
                      <ArrowRight
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </a>
                  </article>
                ),
              )}
            </div>
          </section>

          {/* PARTNER STATUS */}
          <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">

            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--brand-blue)] shadow-sm">
                  <ClipboardCheck
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--brand-blue)]">
                    Application status
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-[var(--brand-navy)]">
                    Your application is under review
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Bookings will become available once CleanKart approves
                    your application and connects the job assignment
                    workflow.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--brand-navy)] p-6 text-white shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[var(--brand-gold)]">
                <Headphones
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Need help?
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Contact CleanKart support if you need help with your
                partner application or services.
              </p>

              <a
                href="#"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-[var(--brand-gold)]"
              >
                Contact support
                <ArrowRight
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </a>
            </div>

          </section>

          {/* NOTICE */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Sparkles
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-amber-900">
                  Partner features are being connected
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Bookings, earnings, payouts and reviews will automatically
                  appear here once their respective CleanKart APIs are
                  connected.
                </p>
              </div>
            </div>
          </div>

        </div>
      </PartnerSection>
    </DashboardShell>
  );
}