import { ArrowRight, CalendarDays } from "lucide-react";

const blogs = [
  {
    date: "31",
    month: "DEC",
    title:
      "Ownwash Franchise Reviews: Is It Worth Starting an...",
    description:
      "Introduction If you are searching for Ownwash Franchise Reviews, you are likely...",
  },
  {
    date: "31",
    month: "DEC",
    title:
      "Unlocking Success: The Power of OwnWash Reviews and...",
    description:
      "Ownwash Reviews: In the bustling world of car care, one name...",
  },
  {
    date: "31",
    month: "DEC",
    title:
      "Elevate Your Car Care Routine: Unveiling Ownwash Reviews",
    description:
      "In today’s fast-paced world, maintaining a clean and fresh car is not...",
  },
];

export default function LatestBlog() {
  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            Our Blogs
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Latest News & Blog
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.title}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Temporary image until client assets arrive */}
              <div className="relative aspect-[16/9] bg-gradient-to-br from-teal-800 to-slate-700">
                <div className="absolute left-4 top-4 z-10 flex min-w-14 flex-col items-center rounded-md bg-white px-3 py-2 shadow-md">
                  <span className="text-xl font-bold text-teal-700">
                    {blog.date}
                  </span>

                  <span className="text-[10px] font-bold text-gray-500">
                    {blog.month}
                  </span>
                </div>

                <div className="flex h-full items-center justify-center text-sm text-white/70">
                  Blog Image
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays className="h-4 w-4" />
                  31 Dec
                </div>

                <h3 className="mt-3 text-lg font-bold leading-7 text-gray-900">
                  {blog.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {blog.description}
                </p>

                <a
                  href="/blog"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}