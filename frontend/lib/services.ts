export type ServiceVariant = {
  id: string;
  name: string;
  price: number;
};

export type Service = {
  id: number;
  name: string;
  slug: string;
  category: string;
  basePrice?: number;
  minPrice?: number;
  maxPrice?: number;
  description: string;
  duration: string;
  images: string[];
  features: string[];
  variants?: ServiceVariant[];
  isActive: boolean;
};

const localImage = (name: string) => "/images/services/" + name;
const remoteImage = (id: string) =>
  "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=1000&q=82";

export const services: Service[] = [
  {
    id: 1,
    name: "Foam Wash",
    slug: "foam-washing",
    category: "Vehicle Care",
    basePrice: 349,
    description:
      "A rich, paint-safe foam wash that lifts everyday dirt and leaves your vehicle fresh and glossy.",
    duration: "45–60 min",
    images: [localImage("car-exterior-wash.jpeg"), localImage("bike-foam-wash.jpeg")],
    features: ["Foam pre-wash", "Wheel and tyre cleaning", "Hand wash and dry"],
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
    images: [localImage("car-interior-cleaning.jpeg"), localImage("carpet-cleaning.jpeg")],
    features: ["Seat and carpet cleaning", "Dashboard and console care", "Interior vacuuming"],
    variants: [
      { id: "hatchback", name: "Hatchback", price: 549 },
      { id: "sedan", name: "Sedan", price: 699 },
      { id: "suv", name: "SUV", price: 849 },
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
    images: [localImage("car-interior-cleaning.jpeg"), localImage("car-exterior-wash.jpeg")],
    features: ["Steam cleaning", "Interior refresh", "Odour-reducing treatment"],
    variants: [
      { id: "hatchback", name: "Hatchback", price: 549 },
      { id: "sedan", name: "Sedan", price: 649 },
      { id: "suv", name: "SUV", price: 749 },
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
    images: [
      localImage("car-exterior-wash.jpeg"),
      localImage("car-interior-cleaning.jpeg"),
      localImage("bike-foam-wash.jpeg"),
    ],
    features: ["Interior detailing", "Exterior hand wash", "Finishing and protection"],
    variants: [
      { id: "hatchback", name: "Hatchback", price: 849 },
      { id: "sedan", name: "Sedan", price: 1199 },
      { id: "suv", name: "SUV", price: 1549 },
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
    images: [localImage("car-exterior-wash.jpeg"), localImage("bike-foam-wash.jpeg")],
    features: ["Paint-safe deep wash", "Wheel and tyre detailing", "Hand dry and finish"],
    variants: [
      { id: "hatchback", name: "Hatchback", price: 549 },
      { id: "sedan", name: "Sedan", price: 699 },
      { id: "suv", name: "SUV", price: 849 },
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
    images: [
      localImage("sofa-steam-cleaning.jpeg"),
      localImage("sofa-cleaning.jpeg"),
      localImage("carpet-cleaning.jpeg"),
    ],
    features: ["Upholstery vacuuming", "Spot and stain treatment", "Fabric-safe cleaning"],
    variants: [
      { id: "single", name: "Single item", price: 449 },
      { id: "medium", name: "Medium set", price: 899 },
      { id: "large", name: "Large set", price: 1449 },
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
    images: [
      remoteImage("photo-1497366754035-f200968a6e72"),
      remoteImage("photo-1524758631624-e2822e304c36"),
    ],
    features: ["Workspace and surface cleaning", "Floor care", "Waste and touchpoint refresh"],
    variants: [
      { id: "small", name: "Small office", price: 449 },
      { id: "medium", name: "Medium office", price: 999 },
      { id: "large", name: "Large office", price: 1849 },
    ],
    isActive: true,
  },
  {
    id: 8,
    name: "House Cleaning",
    slug: "house-cleaning",
    category: "Home Cleaning",
    basePrice: 549,
    description:
      "A practical home clean for floors, surfaces and everyday spaces, delivered at your doorstep.",
    duration: "2–4 hrs",
    images: [
      localImage("bathroom-cleaning.jpeg"),
      localImage("kitchen-cleaning.jpeg"),
      localImage("sofa-cleaning.jpeg"),
    ],
    features: ["Surface dusting", "Floor cleaning", "Kitchen and bathroom refresh"],
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
    images: [
      remoteImage("photo-1621905252507-b35492cc74b4"),
      remoteImage("photo-1581094794329-c8112a89af12"),
    ],
    features: ["Filter cleaning", "Indoor unit care", "Service check"],
    variants: [
      { id: "routine", name: "Routine service", price: 449 },
      { id: "deep", name: "Deep cleaning", price: 899 },
      { id: "premium", name: "Premium service", price: 1449 },
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
    images: [
      remoteImage("photo-1581244277943-fe4a9c777189"),
      remoteImage("photo-1584622650111-993a426fbf0a"),
    ],
    features: ["Tank scrubbing", "Residue removal", "Rinse and sanitisation"],
    variants: [
      { id: "small", name: "Small tank", price: 449 },
      { id: "medium", name: "Medium tank", price: 899 },
      { id: "large", name: "Large tank", price: 1449 },
    ],
    isActive: true,
  },
  {
    id: 11,
    name: "Kitchen Cleaning",
    slug: "kitchen-cleaning",
    category: "Home Cleaning",
    basePrice: 549,
    description:
      "Give your kitchen a detailed clean, including worktops, surfaces and grease-prone areas.",
    duration: "1–2 hrs",
    images: [localImage("kitchen-cleaning.jpeg"), localImage("bathroom-cleaning.jpeg")],
    features: ["Counter and surface cleaning", "Degreasing", "Sink and backsplash refresh"],
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
    images: [localImage("carpet-cleaning.jpeg"), localImage("sofa-steam-cleaning.jpeg")],
    features: ["Deep vacuuming", "Spot treatment", "Carpet refresh"],
    variants: [
      { id: "small", name: "Small carpet", price: 449 },
      { id: "medium", name: "Medium carpet", price: 999 },
      { id: "large", name: "Large carpet", price: 1849 },
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
    images: [localImage("sofa-cleaning.jpeg"), localImage("sofa-steam-cleaning.jpeg")],
    features: ["Dry vacuuming", "Spot treatment", "Fabric-safe finish"],
    variants: [
      { id: "single", name: "Single seat", price: 199 },
      { id: "three", name: "3 seater", price: 899 },
      { id: "full", name: "Full set", price: 1949 },
    ],
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
  return services.find((service) => service.slug === slug);
}

export function getServiceById(id: number) {
  return services.find((service) => service.id === id);
}

export function formatPrice(price: number) {
  return "₹" + price.toLocaleString("en-IN");
}

export function getServicePrice(service: Service) {
  const prices = service.variants?.map((variant) => variant.price);
  const minimum = prices?.length
    ? Math.min(...prices)
    : service.minPrice ?? service.basePrice;
  const maximum = prices?.length
    ? Math.max(...prices)
    : service.maxPrice ?? service.basePrice;

  if (minimum === undefined || maximum === undefined) return "Price on request";
  return minimum === maximum
    ? formatPrice(minimum)
    : formatPrice(minimum) + " – " + formatPrice(maximum);
}
