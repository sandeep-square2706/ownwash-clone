"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import ServiceCard from "@/components/services/ServiceCard";
import { services } from "@/lib/services";

type SortOption = "featured" | "price-low" | "price-high" | "name";

function lowestPrice(service: (typeof services)[number]) {
  return service.variants?.length
    ? Math.min(...service.variants.map((variant) => variant.price))
    : service.minPrice ?? service.basePrice ?? 0;
}

function highestPrice(service: (typeof services)[number]) {
  return service.variants?.length
    ? Math.max(...service.variants.map((variant) => variant.price))
    : service.maxPrice ?? service.basePrice ?? 0;
}

function ServicesContent() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>("featured");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(services.map((service) => service.category))),
    [],
  );

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const result = services.filter((service) => {
      const matchesCategory =
        category === "all" || service.category === category;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [service.name, service.description, service.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      return service.isActive && matchesCategory && matchesSearch;
    });

    if (sort === "price-low") result.sort((a, b) => lowestPrice(a) - lowestPrice(b));
    if (sort === "price-high") result.sort((a, b) => highestPrice(b) - highestPrice(a));
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [category, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / itemsPerPage));
  const visibleServices = filteredServices.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  const firstResult = filteredServices.length === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const lastResult = Math.min(page * itemsPerPage, filteredServices.length);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  function updateSort(value: SortOption) {
    setSort(value);
    setPage(1);
  }

  function updatePageSize(value: number) {
    setItemsPerPage(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1360px] px-4 py-4 text-sm text-slate-500 sm:px-6 lg:px-8">
          <Link href="/" className="transition hover:text-blue-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-blue-950">Services</span>
        </div>
      </div>

      <section className="px-4 pt-5 sm:px-6 lg:px-8">
        <div className="relative mx-auto min-h-[250px] max-w-[1360px] overflow-hidden rounded-3xl bg-blue-950">
          <Image
            src="/images/services/solar-panel-cleaning.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/75 to-blue-950/15" />
          <div className="relative z-10 flex min-h-[250px] max-w-2xl flex-col justify-center px-7 py-8 text-white sm:px-10 lg:px-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              CleanKart services
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              A cleaner home. A happier drive.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
              Choose trusted doorstep care for your car, home and everyday spaces.
            </p>
            <Link
              href="#service-list"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Browse services
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8" id="service-list">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
                Made for your space
              </p>
              <h2 className="mt-2 text-2xl font-bold text-blue-950 sm:text-3xl">
                Explore all services
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              {filteredServices.length} services available
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <label className="relative flex min-h-11 flex-1 items-center">
                <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => updateSearch(event.target.value)}
                  placeholder="Search cleaning services"
                  aria-label="Search services"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-500 sm:min-w-52">
                <SlidersHorizontal className="h-4 w-4 shrink-0" />
                <span className="sr-only">Filter by category</span>
                <select
                  value={category}
                  onChange={(event) => updateCategory(event.target.value)}
                  className="h-10 min-w-0 flex-1 bg-transparent font-medium text-slate-800 outline-none"
                >
                  <option value="all">All categories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-500">
                Sort
                <select
                  value={sort}
                  onChange={(event) => updateSort(event.target.value as SortOption)}
                  className="max-w-44 bg-transparent font-semibold text-blue-950 outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="name">Name</option>
                </select>
              </label>

              <label className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
                Show
                <select
                  value={itemsPerPage}
                  onChange={(event) => updatePageSize(Number(event.target.value))}
                  className="bg-transparent font-semibold text-blue-950 outline-none"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </label>

              <div className="flex overflow-hidden rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                  className={
                    view === "grid"
                      ? "flex h-10 w-10 items-center justify-center bg-blue-950 text-white"
                      : "flex h-10 w-10 items-center justify-center text-slate-500 hover:bg-slate-50"
                  }
                >
                  <Grid2X2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-label="List view"
                  aria-pressed={view === "list"}
                  className={
                    view === "list"
                      ? "flex h-10 w-10 items-center justify-center bg-blue-950 text-white"
                      : "flex h-10 w-10 items-center justify-center text-slate-500 hover:bg-slate-50"
                  }
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <p className="py-4 text-sm text-slate-500" aria-live="polite">
            Showing <span className="font-semibold text-slate-800">{firstResult}–{lastResult}</span>
            {" "}of {filteredServices.length} results
          </p>

          {visibleServices.length > 0 ? (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-5"
              }
            >
              {visibleServices.map((service) => (
                <ServiceCard key={service.id} service={service} listView={view === "list"} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <h3 className="text-xl font-semibold text-blue-950">No services found</h3>
              <p className="mt-2 text-sm text-slate-600">
                Try another search or choose a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  updateSearch("");
                  updateCategory("all");
                }}
                className="mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Clear filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-2 py-10"
              aria-label="Service pages"
            >
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
                aria-label="Previous page"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-950 transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setPage(number)}
                    aria-current={page === number ? "page" : undefined}
                    className={
                      page === number
                        ? "h-10 min-w-10 rounded-xl bg-blue-950 px-3 text-sm font-semibold text-white"
                        : "h-10 min-w-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-blue-950 hover:bg-slate-50"
                    }
                  >
                    {number}
                  </button>
                ),
              )}
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((current) => current + 1)}
                aria-label="Next page"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-950 transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50" />}>
      <ServicesContent />
    </Suspense>
  );
}
