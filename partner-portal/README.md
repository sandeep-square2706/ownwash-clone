# Zaapino Partner Portal

This is the standalone partner website. It has its own Next.js app and deployment,
while partner accounts and data continue to use the existing Django API and database.

## Local development

The customer website and backend should be running on ports 3000 and 8000.

```powershell
cd partner-portal
npm install
npm run dev
```

Open `http://localhost:3002/partner`.

The API defaults to `http://127.0.0.1:8000/api`. Configure
`NEXT_PUBLIC_CLEANKART_API_URL` when the backend uses another URL. The customer
website link defaults to `http://127.0.0.1:3000` in development.

If the backend defines `CORS_ALLOWED_ORIGINS` in its environment, include
`http://localhost:3002` and `http://127.0.0.1:3002` in that list.

## Separate deployment

Deploy this folder as its own Next.js project. Set these public build-time
environment variables:

- `NEXT_PUBLIC_CLEANKART_API_URL`: Django API base URL, ending in `/api`.
- `NEXT_PUBLIC_CUSTOMER_SITE_URL`: customer website origin.

On the customer website deployment, set
`NEXT_PUBLIC_PARTNER_PORTAL_URL` to the partner portal origin (without a path).
That makes customer-site partner links open this app and redirects legacy
`/partner/...` URLs to the same route on the standalone domain.

Add the partner portal origin to Django's `CORS_ALLOWED_ORIGINS`. The customer
website, admin portal, and partner portal remain separate frontends that use
the same API and database. Partner users will need to sign in again on the
standalone domain because browser storage is isolated by origin.
