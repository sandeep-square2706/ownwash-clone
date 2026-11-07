const bikePhoto = "/images/team/zaapino-bike-wash.png";
const carPhoto = "/images/team/zaapino-car-wash.png";
const homePhoto = "/images/team/zaapino-kitchen-cleaning.png";
const solarPhoto = "/images/team/zaapino-solar-panel-cleaning.png";
const servicePhotos: Record<string, string> = {
  "ac-services": "/images/services/ac-services.webp",
  "carpet-cleaning": "/images/services/carpet-cleaning.webp",
  "cobweb-cleaning": "/images/services/cobweb-cleaning.webp",
  "dishwashing-utensils-cleaning": "/images/services/utensils-cleaning.webp",
  "doorstep-garbage-collection": "/images/services/garbage-collection-zaapino.webp",
  "exterior-deep-cleaning": "/images/services/exterior-deep-cleaning.webp",
  "floor-cleaning": "/images/services/floor-cleaning-zaapino.webp",
  "foam-washing": "/images/services/foam-washing.webp",
  "full-car-detailing": "/images/services/full-car-detailing.webp",
  "furniture-cleaning": "/images/services/furniture-cleaning.webp",
  "interior-deep-cleaning": "/images/services/interior-deep-cleaning.webp",
  "kitchen-cleaning": "/images/services/kitchen-cleaning.webp",
  "office-cleaning": "/images/services/office-cleaning.webp",
  "sofa-dry-cleaning": "/images/services/sofa-dry-cleaning.webp",
  "steam-washing": "/images/services/steam-washing.webp",
  "water-tank-cleaning": "/images/services/water-tank-cleaning.webp",
};

const staffPhotoReplacements: Record<string, string> = {
  "ac-cleaning.webp": servicePhotos["ac-services"],
  "ac-services.webp": servicePhotos["ac-services"],
  "ac-services.jpeg": servicePhotos["ac-services"],
  "bathroom-cleaning.jpeg": homePhoto,
  "bike-foam-wash.jpeg": bikePhoto,
  "blog-booking-guide.webp": homePhoto,
  "blog-car-care.webp": carPhoto,
  "blog-sofa-care.webp": homePhoto,
  "car-exterior-wash.jpeg": carPhoto,
  "car-interior-cleaning.jpeg": carPhoto,
  "car-washing.webp": carPhoto,
  "carpet-cleaning.webp": servicePhotos["carpet-cleaning"],
  "carpet-cleaning.jpeg": servicePhotos["carpet-cleaning"],
  "cobweb-cleaning.webp": servicePhotos["cobweb-cleaning"],
  "dishwashing-utensils-cleaning.webp": servicePhotos["dishwashing-utensils-cleaning"],
  "utensils-cleaning.webp": servicePhotos["dishwashing-utensils-cleaning"],
  "doorstep-garbage-collection.webp": servicePhotos["doorstep-garbage-collection"],
  "garbage-collection.webp": servicePhotos["doorstep-garbage-collection"],
  "garbage-collection-zaapino.webp": servicePhotos["doorstep-garbage-collection"],
  "exterior-deep-cleaning.webp": servicePhotos["exterior-deep-cleaning"],
  "exterior-deep-cleaning.jpeg": servicePhotos["exterior-deep-cleaning"],
  "floor-cleaning.webp": servicePhotos["floor-cleaning"],
  "floor-cleaning-zaapino.webp": servicePhotos["floor-cleaning"],
  "franchise-partner.webp": homePhoto,
  "foam-washing.webp": servicePhotos["foam-washing"],
  "foam-washing.jpeg": servicePhotos["foam-washing"],
  "full-car-detailing.webp": servicePhotos["full-car-detailing"],
  "full-car-detailing.jpeg": servicePhotos["full-car-detailing"],
  "furniture-cleaning.webp": servicePhotos["furniture-cleaning"],
  "furniture-cleaning.jpeg": servicePhotos["furniture-cleaning"],
  "home-cleaning.webp": homePhoto,
  "interior-deep-cleaning.webp": servicePhotos["interior-deep-cleaning"],
  "interior-deep-cleaning.jpeg": servicePhotos["interior-deep-cleaning"],
  "kitchen-cleaning.webp": servicePhotos["kitchen-cleaning"],
  "kitchen-cleaning.jpeg": servicePhotos["kitchen-cleaning"],
  "menu-exterior-deep.webp": carPhoto,
  "menu-foam-wash.webp": carPhoto,
  "menu-full-detail.webp": carPhoto,
  "menu-steam-wash.webp": carPhoto,
  "office-cleaning-2.webp": servicePhotos["office-cleaning"],
  "office-cleaning-3.webp": servicePhotos["office-cleaning"],
  "office-cleaning-4.webp": servicePhotos["office-cleaning"],
  "office-cleaning-5.webp": servicePhotos["office-cleaning"],
  "office-cleaning.jpeg": servicePhotos["office-cleaning"],
  "office-cleaning.webp": servicePhotos["office-cleaning"],
  "promo-worker-branded.webp": homePhoto,
  "sofa-dry-cleaning.webp": servicePhotos["sofa-dry-cleaning"],
  "sofa-cleaning.jpeg": servicePhotos["sofa-dry-cleaning"],
  "sofa-dry-cleaning.jpeg": servicePhotos["sofa-dry-cleaning"],
  "sofa-steam-cleaning.jpeg": homePhoto,
  "solar-panel-cleaning.jpeg": solarPhoto,
  "steam-washing.webp": servicePhotos["steam-washing"],
  "steam-washing-2.webp": carPhoto,
  "steam-washing.jpeg": carPhoto,
  "water-tank-cleaning.webp": servicePhotos["water-tank-cleaning"],
  "water-tank-cleaning.jpeg": servicePhotos["water-tank-cleaning"],
};

export function getZaapinoTeamImage(label: string) {
  const normalized = label.toLowerCase();
  const slug = normalized.replace(/[^a-z0-9]+/g, "-");
  const matchingService = Object.keys(servicePhotos)
    .sort((left, right) => right.length - left.length)
    .find((service) => slug.includes(service));
  if (matchingService) {
    return servicePhotos[matchingService];
  }
  if (/\bsolar\b/.test(normalized)) {
    return solarPhoto;
  }
  if (/\bbike\b/.test(normalized)) {
    return bikePhoto;
  }
  if (/\b(office|workplace|business)\b/.test(normalized)) {
    return servicePhotos["office-cleaning"];
  }
  if (/\b(dish|kitchen)\b/.test(normalized)) {
    return servicePhotos["kitchen-cleaning"];
  }
  if (/\b(car|vehicle|foam|exterior|interior|steam|detailing)\b/.test(normalized)) {
    return carPhoto;
  }
  return homePhoto;
}

export function replaceStaffPhoto(source: string) {
  const filename = source.split(/[?#]/, 1)[0].split("/").pop()?.toLowerCase();
  return filename ? staffPhotoReplacements[filename] ?? source : source;
}
