# CleanKart Admin Portal v2

A production-oriented, separate Next.js admin website for CleanKart.

## What this version implements

This portal is based on the supplied reference image and includes:

1. **Admin Login**
   - Only the login screen is shown at `/` when unauthenticated.
   - JWT access/refresh tokens are stored locally/session-wise.
   - The authenticated Django user must have `role === "ADMIN"`.
   - Customer and Cleaning Partner accounts are rejected.
   - Direct navigation to protected pages redirects to `/admin/login`.

2. **Dashboard / Overview**
   - Total bookings
   - Total revenue
   - Active customers
   - Active partners
   - Booking trend
   - Booking status counts
   - All values come from `/api/admin/dashboard/`.
   - No seeded numbers and no fake charts.

3. **Bookings Management**
   - Search
   - Real booking table
   - Booking details
   - Status actions
   - Add booking screen

4. **Customer Management**
   - Real customer table
   - Search
   - Customer detail screen

5. **Cleaning Partner Management**
   - Real partner table
   - Search
   - Partner detail screen
   - Designed for approval/status workflows in the backend

6. **Services & Pricing**
   - Real service catalog
   - Price/category/duration/status
   - Add service screen
   - Edit/detail route

7. **Offers & Discounts**
   - Real offer table
   - Create offer screen

8. **Banners**
   - Real banner list
   - Create banner screen

9. **Push Notifications**
   - Real notification history
   - Send notification screen
   - Backend is expected to dispatch through Firebase

10. **Reports & Analytics**
    - Real server-generated totals
    - Daily report table
    - No fake graph values

11. **Payments & Refunds**
    - Real payment list
    - Payment detail route
    - Refund actions should be exposed by the backend API

12. **Reviews**
    - Real reviews and moderation status

13. **Settings**
    - Admin profile loaded from the real Django API

## Important: no fake data

There is intentionally **no mock customer, booking, partner, service, revenue, chart, offer, banner or notification data** in this project.

If the PostgreSQL database is empty, the portal shows empty states / dashes.

If an endpoint has not been implemented on Django yet, the portal shows the API error instead of inventing data.

## Expected local setup

```text
CleanKart
├── frontend/      http://localhost:3000
├── admin-portal/  http://localhost:3001
├── backend/       http://127.0.0.1:8000
└── PostgreSQL
```

Create `.env.local`:

```env
NEXT_PUBLIC_CLEANKART_API_URL=http://127.0.0.1:8000/api
```

Install and run:

```powershell
cd admin-portal
npm install
npm run dev
```

Open:

```text
http://localhost:3001
```

## Backend integration

The portal expects these authenticated Django REST endpoints:

```text
POST   /api/auth/login/
GET    /api/auth/profile/

GET    /api/admin/dashboard/

GET    /api/admin/bookings/
POST   /api/admin/bookings/
GET    /api/admin/bookings/<id>/
PATCH  /api/admin/bookings/<id>/

GET    /api/admin/customers/
GET    /api/admin/customers/<id>/

GET    /api/admin/partners/
GET    /api/admin/partners/<id>/

GET    /api/admin/services/
POST   /api/admin/services/
GET    /api/admin/services/<id>/
PATCH  /api/admin/services/<id>/

GET    /api/admin/offers/
POST   /api/admin/offers/

GET    /api/admin/banners/
POST   /api/admin/banners/

GET    /api/admin/notifications/
POST   /api/admin/notifications/

GET    /api/admin/reports/

GET    /api/admin/payments/
GET    /api/admin/payments/<id>/
POST   /api/admin/payments/...
POST   /api/admin/refunds/...

GET    /api/admin/reviews/
PATCH  /api/admin/reviews/<id>/

```

## Backend security requirement

The Django backend must enforce admin authorization. Do not rely on frontend route protection.

Every `/api/admin/*` endpoint should require:

```python
IsAuthenticated
```

and then:

```python
request.user.role == User.Role.ADMIN
```

A Customer or Cleaning Partner must receive HTTP 403.

## Data source rule

The admin website and customer website must use the **same Django API and PostgreSQL database**.

Do not create a second admin database.

```text
Customer website ─┐
Partner website ──┼── Django REST API ─── PostgreSQL
Admin website ────┘
```

## Design direction from supplied reference

The portal intentionally follows the reference structure:

- CleanKart blue/cyan visual language
- Dark navy sidebar
- White content panels
- Compact operational tables
- Dashboard KPI cards
- Search/filter toolbars
- Status badges
- Booking detail workflow
- Services/pricing editor
- Offers/discounts
- Banners
- Push notifications
- Reports/analytics
- Payments/reviews/settings

It does not copy OwnWash branding, logos or proprietary assets.

## Next engineering step

The remaining backend work is to implement the `/api/admin/*` Django endpoints against the existing CleanKart models. Once those endpoints exist, this portal consumes live records without changing its UI data source.
