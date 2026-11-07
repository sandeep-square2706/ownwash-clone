const configuredPartnerPortalUrl =
  process.env.NEXT_PUBLIC_PARTNER_PORTAL_URL?.trim().replace(/\/+$/, "");

const partnerPortalOrigin =
  configuredPartnerPortalUrl ||
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:3002"
    : "");

export const partnerPortalHref = partnerPortalOrigin
  ? `${partnerPortalOrigin}/partner`
  : "/partner";
