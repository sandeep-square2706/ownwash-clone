const configuredCustomerSiteUrl =
  process.env.NEXT_PUBLIC_CUSTOMER_SITE_URL?.trim().replace(/\/+$/, "");

export const customerSiteUrl =
  configuredCustomerSiteUrl ||
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:3000" : "");
