import { MapPin, Star, UsersRound } from "lucide-react";

const stats = [
  { value: "2000+", label: "All Over Rating" },
  { value: "5000+", label: "Happy Customers" },
  { value: "50+", label: "Cities Available" },
];

export default function HomeStats() {
  return (
    <section
      aria-label="Zaapino at a glance"
      className="bg-white px-4 pb-8 pt-1 sm:px-6 lg:px-[4.5vw]"
    >
      <div className="grid w-full gap-3 sm:grid-cols-3 sm:gap-5">
        {stats.map(({ value, label }, index) => (
          <article
            key={label}
            className="flex min-h-[92px] items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_4px_16px_rgba(16,44,95,0.04)] sm:px-5"
          >
            <div>
              <p className="text-[30px] font-bold leading-none text-[#087b78] sm:text-[36px]">
                {value}
              </p>
              <p className="mt-1.5 text-base font-medium text-slate-950 sm:text-lg">
                {label}
              </p>
            </div>
            <div
              aria-hidden="true"
              className="ml-3 flex h-12 w-16 shrink-0 items-center justify-center text-[#1598b5]"
            >
              {index === 0 && (
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 fill-current ${star === 2 ? "h-6 w-6" : ""}`}
                    />
                  ))}
                </div>
              )}
              {index === 1 && <UsersRound className="h-9 w-9" />}
              {index === 2 && (
                <div className="relative">
                  <MapPin className="h-8 w-8 fill-current" />
                  <MapPin className="absolute -bottom-1 -right-4 h-6 w-6 fill-current" />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
