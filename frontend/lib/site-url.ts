export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, "");

  const vercelHost = process.env.VERCEL_URL?.trim();
  return vercelHost ? `https://${vercelHost}` : undefined;
}
