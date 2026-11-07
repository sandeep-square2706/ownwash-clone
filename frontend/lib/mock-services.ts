export type ServiceVariant = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
};

export type ServiceAddon = {
  id: string;
  name: string;
  price: number;
};

export type ServiceFAQ = {
  question: string;
  answer: string;
};

export type Service = {
  id: number;
  name: string;
  slug: string;
  category: string;
  basePrice?: number;
  minPrice?: number;
  maxPrice?: number;
  originalPrice?: number;
  description: string;
  duration: string;
  images: string[];
  features: string[];
  included?: string[];
  excluded?: string[];
  addons?: ServiceAddon[];
  faqs?: ServiceFAQ[];
  rating?: number;
  reviewCount?: number;
  variants?: ServiceVariant[];
  isActive: boolean;
  isTopService?: boolean;
};

const localImage = (name: string) => "/images/services/" + name;

export const mockServices: Service[] = [
  {
    id: 1,
    name: "Foam Washing",
    slug: "foam-washing",
    category: "Vehicle Care",
    basePrice: 349,
    originalPrice: 399,
    description:
      "A rich, paint-safe foam wash that lifts everyday dirt and leaves your vehicle fresh and glossy.",
    duration: "45–60 min",
    images: [localImage("foam-washing.webp")],
    features: ["Foam pre-wash", "Wheel and tyre cleaning", "Hand wash and dry"],
    addons: [
      { id: "spray-wax", name: "Spray wax finish", price: 199 },
      { id: "interior-vacuum", name: "Interior vacuum", price: 249 },
    ],
    isActive: true,
  },
  {
    id: 2,
    name: "Interior Deep Cleaning",
    slug: "interior-deep-cleaning",
    category: "Vehicle Care",
    minPrice: 549,
    maxPrice: 849,
    description:
      "A detailed interior refresh for seats, carpets, dashboard, doors and hard-to-reach areas.",
    duration: "2–3 hrs",
    images: [localImage("interior-deep-cleaning.webp")],
    features: ["Seat and carpet cleaning", "Dashboard and console care", "Interior vacuuming"],
    addons: [{ id: "odor-treatment", name: "Odour treatment", price: 149 }],
    variants: [
      { id: "hatchback", name: "Hatchback", price: 549, originalPrice: 599 },
      { id: "sedan", name: "Sedan", price: 699, originalPrice: 749 },
      { id: "suv", name: "SUV", price: 849, originalPrice: 899 },
    ],
    isActive: true,
  },
  {
    id: 3,
    name: "Steam Washing",
    slug: "steam-washing",
    category: "Vehicle Care",
    minPrice: 549,
    maxPrice: 749,
    description:
      "A careful steam clean that refreshes your vehicle interior and helps lift stubborn grime.",
    duration: "60–90 min",
    images: [localImage("steam-washing.webp")],
    features: ["Steam cleaning", "Interior refresh", "Odour-reducing treatment"],
    variants: [
      { id: "hatchback", name: "Hatchback", price: 549, originalPrice: 599 },
      { id: "sedan", name: "Sedan", price: 649, originalPrice: 699 },
      { id: "suv", name: "SUV", price: 749, originalPrice: 799 },
    ],
    isActive: true,
  },
  {
    id: 4,
    name: "Full Car Detailing",
    slug: "full-car-detailing",
    category: "Vehicle Care",
    minPrice: 849,
    maxPrice: 1549,
    description:
      "A complete inside-and-out detail for a polished finish and a cabin that feels refreshed.",
    duration: "3–5 hrs",
    images: [localImage("full-car-detailing.webp")],
    features: ["Interior detailing", "Exterior hand wash", "Finishing and protection"],
    variants: [
      { id: "hatchback", name: "Hatchback", price: 849, originalPrice: 899 },
      { id: "sedan", name: "Sedan", price: 1199, originalPrice: 1249 },
      { id: "suv", name: "SUV", price: 1549, originalPrice: 1599 },
    ],
    isActive: true,
  },
  {
    id: 5,
    name: "Exterior Deep Cleaning",
    slug: "exterior-deep-cleaning",
    category: "Vehicle Care",
    minPrice: 549,
    maxPrice: 849,
    description:
      "A deeper exterior clean for paintwork, wheels and trim, finished with a careful hand dry.",
    duration: "60–90 min",
    images: [localImage("exterior-deep-cleaning.webp")],
    features: ["Paint-safe deep wash", "Wheel and tyre detailing", "Hand dry and finish"],
    variants: [
      { id: "hatchback", name: "Hatchback", price: 549, originalPrice: 599 },
      { id: "sedan", name: "Sedan", price: 699, originalPrice: 749 },
      { id: "suv", name: "SUV", price: 849, originalPrice: 899 },
    ],
    isActive: true,
  },
  {
    id: 6,
    name: "Furniture Cleaning",
    slug: "furniture-cleaning",
    category: "Home Cleaning",
    minPrice: 449,
    maxPrice: 1449,
    description:
      "Freshen up fabric furniture with professional vacuuming, stain care and upholstery cleaning.",
    duration: "1–2 hrs",
    images: [localImage("furniture-cleaning.webp")],
    features: ["Upholstery vacuuming", "Spot and stain treatment", "Fabric-safe cleaning"],
    addons: [{ id: "fabric-protection", name: "Fabric protection", price: 199 }],
    variants: [
      { id: "single", name: "Single item", price: 449, originalPrice: 499 },
      { id: "medium", name: "Medium set", price: 899, originalPrice: 949 },
      { id: "large", name: "Large set", price: 1449, originalPrice: 1499 },
    ],
    isActive: true,
  },
  {
    id: 7,
    name: "Office Cleaning",
    slug: "office-cleaning",
    category: "Home & Office",
    minPrice: 449,
    maxPrice: 1849,
    description:
      "Reliable cleaning for workspaces, shared areas and office floors, scheduled around your day.",
    duration: "1–4 hrs",
    images: [localImage("office-cleaning.webp")],
    features: ["Workspace and surface cleaning", "Floor care", "Waste and touchpoint refresh"],
    variants: [
      { id: "small", name: "Small office", price: 449, originalPrice: 499 },
      { id: "medium", name: "Medium office", price: 999, originalPrice: 1049 },
      { id: "large", name: "Large office", price: 1849, originalPrice: 1899 },
    ],
    isActive: true,
  },
  {
    id: 15,
    name: "Floor Cleaning",
    slug: "floor-cleaning",
    category: "Home Cleaning",
    minPrice: 399,
    maxPrice: 899,
    description:
      "Professional floor cleaning for apartments and homes, with a plan matched to your floor area.",
    duration: "45–60 min",
    images: [localImage("floor-cleaning-zaapino.webp")],
    features: ["Dust and dirt removal", "Mopping with professional cleaner", "Safe care for common floor types"],
    variants: [
      { id: "1-bhk", name: "1 BHK · up to 600 sq. ft.", price: 399 },
      { id: "2-bhk", name: "2 BHK · up to 1,000 sq. ft.", price: 549 },
      { id: "3-bhk", name: "3 BHK · up to 1,500 sq. ft.", price: 699 },
      { id: "4-bhk", name: "4 BHK · up to 2,000 sq. ft.", price: 899 },
    ],
    isActive: true,
  },
  {
    id: 16,
    name: "Dishwashing & Utensils Cleaning",
    slug: "dishwashing-utensils-cleaning",
    category: "Home Cleaning",
    minPrice: 99,
    maxPrice: 299,
    description:
      "Convenient cleaning for used dishes, cookware and kitchen utensils, with hygienic rinsing and neat arrangement.",
    duration: "30–60 min",
    images: [localImage("utensils-cleaning.webp")],
    features: [
      "Washing plates, bowls, glasses and cookware",
      "Removal of grease and food residue",
      "Rinsing and arranging utensils neatly",
      "Safe, food-grade cleaning products",
      "Extra utensils above 30: ₹10 each",
    ],
    variants: [
      { id: "small", name: "Small · up to 10 utensils", price: 99 },
      { id: "medium", name: "Medium · up to 20 utensils", price: 199 },
      { id: "large", name: "Large · up to 30 utensils", price: 299 },
    ],
    isActive: true,
  },
  {
    id: 17,
    name: "Doorstep Garbage Collection",
    slug: "doorstep-garbage-collection",
    category: "Home Services",
    minPrice: 49,
    maxPrice: 399,
    description:
      "Scheduled doorstep pickup for household waste, with flexible one-time and recurring collection plans.",
    duration: "Scheduled pickup",
    images: [localImage("garbage-collection-zaapino.webp")],
    features: [
      "Convenient doorstep pickup",
      "Separate wet and dry waste",
      "Responsible waste collection",
      "Choose one-time or recurring collection",
    ],
    variants: [
      { id: "one-time", name: "One-time pickup", price: 49 },
      { id: "weekly", name: "Weekly collection · per month", price: 149 },
      { id: "alternate-day", name: "Alternate-day collection · per month", price: 249 },
      { id: "daily", name: "Daily collection · per month", price: 399 },
    ],
    isActive: true,
  },
  {
    id: 9,
    name: "AC Services",
    slug: "ac-services",
    category: "Home Services",
    minPrice: 449,
    maxPrice: 1449,
    description:
      "A technician visit for AC cleaning and service, with options for routine care or a deeper clean.",
    duration: "60–90 min",
    images: [localImage("ac-services.webp")],
    features: ["Filter cleaning", "Indoor unit care", "Service check"],
    variants: [
      { id: "routine", name: "Routine service", price: 449, originalPrice: 499 },
      { id: "deep", name: "Deep cleaning", price: 899, originalPrice: 949 },
      { id: "premium", name: "Premium service", price: 1449, originalPrice: 1499 },
    ],
    isActive: true,
  },
  {
    id: 10,
    name: "Water Tank Cleaning",
    slug: "water-tank-cleaning",
    category: "Home Services",
    minPrice: 449,
    maxPrice: 1449,
    description:
      "A thorough tank clean with scrubbing, residue removal and a final hygiene-focused rinse.",
    duration: "1–2 hrs",
    images: [localImage("water-tank-cleaning.webp")],
    features: ["Tank scrubbing", "Residue removal", "Rinse and sanitisation"],
    variants: [
      { id: "small", name: "Small tank", price: 449, originalPrice: 499 },
      { id: "medium", name: "Medium tank", price: 899, originalPrice: 949 },
      { id: "large", name: "Large tank", price: 1449, originalPrice: 1499 },
    ],
    isActive: true,
  },
  {
    id: 11,
    name: "Kitchen Cleaning",
    slug: "kitchen-cleaning",
    category: "Home Cleaning",
    basePrice: 549,
    originalPrice: 599,
    description:
      "Give your kitchen a detailed clean, including worktops, surfaces and grease-prone areas.",
    duration: "1–2 hrs",
    images: [localImage("kitchen-cleaning.webp")],
    features: ["Counter and surface cleaning", "Degreasing", "Sink and backsplash refresh"],
    addons: [{ id: "appliance-exterior", name: "Appliance exterior clean", price: 149 }],
    isActive: true,
  },
  {
    id: 12,
    name: "Carpet Cleaning",
    slug: "carpet-cleaning",
    category: "Home Cleaning",
    minPrice: 449,
    maxPrice: 1849,
    description:
      "Deep carpet care that targets dust and everyday marks to leave your room feeling fresh.",
    duration: "1–3 hrs",
    images: [localImage("carpet-cleaning.webp")],
    features: ["Deep vacuuming", "Spot treatment", "Carpet refresh"],
    variants: [
      { id: "small", name: "Small carpet", price: 449, originalPrice: 499 },
      { id: "medium", name: "Medium carpet", price: 999, originalPrice: 1049 },
      { id: "large", name: "Large carpet", price: 1849, originalPrice: 1899 },
    ],
    isActive: true,
  },
  {
    id: 13,
    name: "Sofa-Dry Cleaning",
    slug: "sofa-dry-cleaning",
    category: "Home Cleaning",
    minPrice: 199,
    maxPrice: 1949,
    description:
      "Refresh sofa fabric with careful dust removal and spot care, suited to your seating size.",
    duration: "1–3 hrs",
    images: [localImage("sofa-dry-cleaning.webp")],
    features: ["Dry vacuuming", "Spot treatment", "Fabric-safe finish"],
    variants: [
      { id: "single", name: "Single seat", price: 199, originalPrice: 249 },
      { id: "three", name: "3 seater", price: 899, originalPrice: 949 },
      { id: "full", name: "Full set", price: 1949, originalPrice: 1999 },
    ],
    isActive: true,
  },
  {
    id: 14,
    name: "Cobweb Cleaning",
    slug: "cobweb-cleaning",
    category: "Home Cleaning",
    basePrice: 299,
    description:
      "Careful high-reach dusting to remove cobwebs from ceilings, corners and other hard-to-reach areas.",
    duration: "45–60 min",
    images: [localImage("cobweb-cleaning.webp")],
    features: ["Ceiling and corner cobweb removal", "High-reach dusting", "Tidy clean-up after service"],
    isActive: true,
  },
];

export const topServiceSlugs = [
  "foam-washing",
  "interior-deep-cleaning",
  "steam-washing",
  "full-car-detailing",
  "exterior-deep-cleaning",
];

export function getServiceBySlug(slug: string) {
  return mockServices.find((service) => service.slug === slug);
}

export function getServiceById(id: number) {
  return mockServices.find((service) => service.id === id);
}

export function formatPrice(price: number) {
  return "₹" + price.toLocaleString("en-IN");
}

export function getServicePrice(service: Service) {
  const prices = service.variants?.map((variant) => variant.price);
  const startingPrice = prices?.length
    ? Math.min(...prices)
    : service.minPrice ?? service.basePrice;

  if (startingPrice === undefined) return "Price on request";
  return formatPrice(startingPrice);
}
