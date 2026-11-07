# CleanKart frontend API contract

The frontend currently runs against `lib/mock-services.ts` when `NEXT_PUBLIC_CLEANKART_API_URL` is unset. `lib/services.ts` is the service data boundary. Set the public API base URL only when the backend exposes the response shapes below. The backend must remain authoritative for identity, availability, pricing, orders and payment status.

## Service catalogue

`GET /api/services/`

Return either a JSON array or `{ "results": [...] }`. Each service uses the following shape:

```json
{
  "id": 1,
  "name": "Foam Wash",
  "slug": "foam-washing",
  "category": "Vehicle Care",
  "basePrice": 349,
  "description": "A paint-safe foam wash for your vehicle.",
  "duration": "45–60 min",
  "images": ["/media/services/car-foam-wash.jpg"],
  "features": ["Foam pre-wash", "Wheel and tyre cleaning"],
  "addons": [{ "id": "spray-wax", "name": "Spray wax finish", "price": 199 }],
  "isActive": true
}
```

For services with options, include `variants: [{ "id", "name", "price" }]` and `minPrice`/`maxPrice`. Optional service detail fields are `originalPrice`, `included`, `excluded`, `faqs`, `rating` and `reviewCount`. Image URLs must be public customer-facing assets; identity documents must never be served from the public frontend.

`GET /api/services/{slug}/`

Return one service in the same shape. A missing or inactive service should return HTTP 404.

## Future customer endpoints

These endpoints are documented for the backend integration phase. The current preview does not call them.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/categories/` | Active service categories |
| GET, POST | `/api/cart/` | Authenticated cart state and item IDs/options |
| GET, POST, DELETE | `/api/wishlist/` | Customer wishlist |
| POST | `/api/bookings/` | Validate service, variant, add-ons, address and slot; calculate price server-side |
| POST | `/api/payments/create-order/` | Create a payment order from a validated booking |
| POST | `/api/payments/verify/` | Verify provider signature and update payment status |
| GET | `/api/orders/` | Customer booking history |
| GET, PATCH | `/api/profile/` | Authenticated profile |
| POST | `/api/partner/apply/` | Partner application through protected document storage |
| GET | `/api/notifications/` | Customer notification list |

## Customer email verification

`POST /api/auth/register/` creates an unverified customer account, sends a
24-hour single-use email verification link, and does not issue login tokens.
`POST /api/auth/verify-email/` accepts `{ "token": "..." }`; only after success
can a customer log in. `POST /api/auth/resend-verification/` accepts an email
address and sends another link for an eligible account, subject to a one-minute
resend cooldown. Existing accounts are kept verified during migration.

For local development, Django writes verification emails to the backend
console. Configure SMTP for delivery in production with `EMAIL_HOST`,
`EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS` or
`EMAIL_USE_SSL`, and `DEFAULT_FROM_EMAIL`. Set `CUSTOMER_FRONTEND_URL` to the
public website origin so links point to its `/verify-email` page.

## Offers and coupons

`GET /api/offers/` returns active, in-date offers enabled for the home-page
banner, including the coupon code customers can use at checkout.

Authenticated checkout can validate a code against the server-side cart with
`POST /api/bookings/validate-coupon/` and `{ "coupon_code": "SAVE20" }`.
`POST /api/bookings/` accepts an optional `coupon_code`; the backend revalidates
it and calculates the final discount from authoritative cart prices. The
existing automatic first-booking discount stacks with a coupon, with the
combined discount capped at the subtotal.

## Trust boundary

The browser cart and displayed totals are preview state. A live booking request should send service IDs, variant IDs, add-on IDs, address and availability slot identifiers. It must not be accepted as authoritative for a price, discount, role, payment result or booking confirmation. The backend must recalculate the total, validate availability, create the payment order, verify the payment signature and only then confirm the booking.
