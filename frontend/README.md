# CleanKart frontend

CleanKart is a responsive Next.js service marketplace preview built with the provided brand logo and service photographs. The current checkout, sign-in, contact, newsletter and franchise forms are presentation flows only. They do not send data, authenticate a user, reserve a service or process a payment.

## Run locally

From this directory:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment

The app works with isolated seed data when no API is configured. To point the catalog at a backend, create `.env.local` in this directory:

```text
NEXT_PUBLIC_CLEANKART_API_URL=https://your-api-host
NEXT_PUBLIC_SITE_URL=https://your-site-host
```

These are public base URLs. Never put payment secrets, database credentials, or authentication secrets in a `NEXT_PUBLIC_` variable. The expected service API response and the future booking/payment boundary are described in [API_CONTRACT.md](./API_CONTRACT.md).

## Main routes

- `/` — CleanKart home
- `/services` — searchable, filterable service catalogue
- `/services/[slug]` — service details, options, add-ons and preview cart action
- `/wishlist`, `/cart` — browser-local preview state
- `/checkout` — address, contact, schedule and payment-method preview
- `/account`, `/reviews`, `/faq`, `/contact`, `/franchise`, `/partner`, `/about`
- `/privacy`, `/terms`

## Deploy to Vercel

Use the `frontend` directory as the Vercel project Root Directory. The app uses the Next.js framework preset and `npm run build`. Vercel’s generated deployment URL is used for preview metadata. Set `NEXT_PUBLIC_SITE_URL` to the canonical site URL when a production domain is selected. Configure `NEXT_PUBLIC_CLEANKART_API_URL` only after a compatible API is available.

No Vercel project or deployment is created by this repository setup.
