import Image from "next/image";

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
      aria-label="CleanKart"
      className={`pointer-events-none absolute z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-white/80 bg-white/95 p-0.5 shadow-md ${className}`}
    >
      <Image
        src="/images/logo/cleankart-logo.png"
        alt="CleanKart logo"
        width={28}
        height={28}
        className="h-full w-full object-contain"
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
  return (
    <>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={className} />
      <CleanKartImageStamp className="bottom-2 right-2" />
    </>
  );
}
