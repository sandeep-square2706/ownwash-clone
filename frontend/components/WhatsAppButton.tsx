
"use client";

export default function WhatsAppButton() {
  const phoneNumber = "919110388387";
  const message = encodeURIComponent("Need help?");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Need help? Chat with CleanKart on WhatsApp"
      className="group fixed bottom-5 right-5 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(0,0,0,0.22)] transition-all duration-300 hover:scale-110 hover:shadow-[0_10px_30px_rgba(37,211,102,0.4)]"
    >
      {/* Hover message */}
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-[#102c5f] px-3 py-2 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100">
        Need help?
      </span>

      {/* WhatsApp icon */}
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 fill-current"
        aria-hidden="true"
      >
        <path d="M19.11 17.19c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.34-.79-.7-1.32-1.56-1.48-1.82-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.98 2.63 1.11 2.81c.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.57.66.21 1.26.18 1.73.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
        <path d="M16.01 3.2a12.78 12.78 0 0 0-10.9 19.47L3.2 28.8l6.3-1.86A12.8 12.8 0 1 0 16.01 3.2zm0 23.36c-2.01 0-3.98-.54-5.71-1.57l-.41-.24-3.74 1.1 1.12-3.64-.27-.42a10.58 10.58 0 1 1 9.01 4.77z" />
      </svg>
    </a>
  );
}
