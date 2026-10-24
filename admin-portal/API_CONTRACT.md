# CleanKart Admin API Contract

This is the backend contract for the admin portal. All responses must contain real PostgreSQL data.

## Authentication

### POST `/api/auth/login/`

Request:

```json
{
  "email": "admin@example.com",
  "password": "..."
}
```

Response:

```json
{
  "access": "...",
  "refresh": "...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "ADMIN",
    "first_name": "..."
  }
}
```

The admin portal rejects users whose role is not `ADMIN`.

## Authorization

Every `/api/admin/*` endpoint must require JWT authentication and an admin-role permission.

Expected non-admin response:

```json
{
  "detail": "Admin access required."
}
```

HTTP status: `403`.

## List response

Preferred DRF pagination:

```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

An unpaginated array is also supported by the portal.

## Dashboard

`GET /api/admin/dashboard/`

Example shape when database is empty:

```json
{
  "total_bookings": 0,
  "total_revenue": 0,
  "active_customers": 0,
  "active_partners": 0,
  "booking_trend": [],
  "status_counts": {}
}
```

Important: these zeros are computed from the database. Do not hard-code them in the frontend.

## Bookings

`GET /api/admin/bookings/`

Each row should provide:

- `id`
- `customer_name` or `customer: { name, email, phone }`
- `service_name` or `service: { name }`
- `scheduled_at` or `date` + `time`
- `status`
- `total_amount` or `amount`
- optional partner

`GET /api/admin/bookings/<id>/`

`POST /api/admin/bookings/`

`PATCH /api/admin/bookings/<id>/`

The PATCH endpoint must validate booking status transitions on the server.

## Customers

`GET /api/admin/customers/`

Recommended fields:

- id
- name
- email
- phone
- booking_count
- total_spend
- is_active
- date_joined

`GET /api/admin/customers/<id>/`

## Cleaning Partners

`GET /api/admin/partners/`

Recommended fields:

- id
- name
- email
- phone
- location
- status
- total_jobs
- rating

`GET /api/admin/partners/<id>/`

Partner document access must remain private and authorized.

## Services

`GET /api/admin/services/`
`POST /api/admin/services/`
`GET /api/admin/services/<id>/`
`PATCH /api/admin/services/<id>/`

Recommended fields:

- id
- name
- slug
- category
- base_price
- min_price
- max_price
- duration
- is_active
- image

## Offers

`GET /api/admin/offers/`
`POST /api/admin/offers/`

Recommended fields:

- id
- name
- type
- value
- valid_from
- valid_to
- is_active

## Banners

`GET /api/admin/banners/`
`POST /api/admin/banners/`

Recommended fields:

- id
- title
- image
- placement
- is_active

Use Django media storage for uploaded files.

## Notifications

`GET /api/admin/notifications/`
`POST /api/admin/notifications/`

The POST operation should validate audience and create a notification record. Firebase delivery should happen server-side. Firebase credentials must never be exposed to the browser.

## Reports

`GET /api/admin/reports/`

Recommended response:

```json
{
  "total_bookings": 0,
  "total_revenue": 0,
  "active_customers": 0,
  "active_partners": 0,
  "daily": []
}
```

## Payments and refunds

`GET /api/admin/payments/`
`GET /api/admin/payments/<id>/`

Refund creation should be a dedicated POST operation and must be idempotent.

Never let the browser decide the refundable amount. The backend must verify the payment and booking state before calling Razorpay.

## Reviews

`GET /api/admin/reviews/`
`PATCH /api/admin/reviews/<id>/`

Moderation state changes must be validated server-side.

## Empty database rule

If there are no records:

- dashboard counters are computed as `0`
- arrays are empty
- the UI shows empty states
- no seed/demo records are created by the admin frontend
