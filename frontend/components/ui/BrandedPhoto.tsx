import Image from "next/image";
import { replaceStaffPhoto } from "@/lib/zaapino-team-images";

type BrandedPhotoProps = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function CleanKartImageStamp({ className = "" }: { className?: string }) {
  return (
    <span
      aria-label="Zaapino"
      className={`pointer-events-none absolute z-20 flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-black shadow-md ${className}`}
    >
      <Image
        src="/images/logo/zaapino-logo-transparent.png"
        alt="Zaapino logo"
        width={28}
        height={28}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

export default function BrandedPhoto({
  src,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = "object-cover",
  priority = false,
}: BrandedPhotoProps) {
  const imageSource = replaceStaffPhoto(src);
  return (
    <>
      <Image src={imageSource} alt={alt} fill priority={priority} sizes={sizes} className={className} />
      {imageSource === src ? <CleanKartImageStamp className="bottom-2 right-2" /> : null}
    </>
  );
}
