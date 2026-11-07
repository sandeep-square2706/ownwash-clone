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
  "partner_logins": 0,
  "booking_trend": [],
  "status_counts": {}
}
```

`partner_logins` is the all-time total of successful partner sign-ins through email/password or OTP. Repeated sign-ins each increment the count; failed attempts and registration do not.

Important: these values are computed from the database. Do not hard-code them in the frontend.

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

`POST /api/admin/partners/` creates an approved partner account and records the
admin approval. Required fields are `legal_name`, `email`, and `phone`;
`display_name`, `business_name`, `partner_type`, `city`, and `state` are optional.
Email and phone must not already belong to an account. The response includes a
random `temporary_password` once so the admin can share it securely; it is
stored only as a password hash. Do not log or persist the temporary password.

Partner self-registration remains available through `POST /api/partners/register/`
and creates an application for review rather than an immediately approved account.

`GET /api/admin/partners/<id>/`

The partner detail response includes submitted profile, address, availability,
service, payout, document metadata, and approval-history details. Only the
partner's masked bank account number is included. Private partner documents can
be downloaded only by an authenticated admin through
`GET /api/admin/partners/<id>/documents/<document_id>/download/`.

`POST /api/admin/partners/<id>/action/` accepts `{"action":"approve"}` to approve
a submitted application. It also accepts `reject` or `request-info` with a
non-empty `reason`. An approved partner can be blocked with `suspend` and a
non-empty `reason`, then restored with `unblock`. Blocking retains the account
and its history, prevents new partner logins, and rejects requests from existing
tokens. Review and block actions are recorded in approval history.

Partner document access must remain private and authorized.

## Services

`GET /api/admin/services/`
`POST /api/admin/services/`
`GET /api/admin/services/<id>/`
`PATCH /api/admin/services/<id>/`
`DELETE /api/admin/services/<id>/`

Admin create and update accept multipart form data, including an optional
service image. The category name is created if needed. Removing a service
deactivates it, so it disappears from the public catalog without breaking
existing references. Only active services are returned by `GET /api/services/`
and `GET /api/services/<slug>/`; `is_top_service` controls featured home-page
placement.

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
`GET`, `PATCH`, `DELETE /api/admin/offers/<id>/`

Offer records include:

- `id`, `name`, `description`, `code`
- `type`: `PERCENTAGE` or `FIXED_AMOUNT`
- `value`, `minimum_order`, `valid_from`, `valid_to`
- `is_active`, `show_on_homepage`

`DELETE` deactivates the offer so existing booking history remains intact.
Homepage-visible offers are returned by the public endpoint:

`GET /api/offers/`

Only active, in-date offers with `show_on_homepage=true` are returned. The
customer enters the displayed coupon code at checkout. An eligible first-booking
discount remains automatic and stacks with the entered coupon; total discounts
are capped at the service subtotal.

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
`POST /api/admin/payments/<id>/upi-review/`

Direct UPI payments are listed with `method: "DIRECT_UPI"`, their
`upi_transaction_reference`, and `status: "PENDING_REVIEW"`. An admin may
approve with `{"decision":"approve"}` only after independently checking the
transaction in the receiving bank/UPI account. Approval captures the payment
record and confirms its booking in one database transaction. To reject, send
`{"decision":"reject","note":"<reason>"}`; the reason is retained and the
booking stays pending payment.

The customer checkout gets public payee details from
`GET /api/payments/upi/config/`, creates a server-priced pending booking, and
submits a transaction reference to `POST /api/payments/upi/submit/`. Customer
claims must never confirm a booking without admin verification. Configure the
backend with `DIRECT_UPI_VPA` and `DIRECT_UPI_PAYEE_NAME`.

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
