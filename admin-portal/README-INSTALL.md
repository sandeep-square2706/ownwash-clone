# CleanKart Admin Portal – Service Management Update

This is an update patch for the existing repository `sandeep-square2706/ownwash-clone`. It keeps the existing admin login, navigation, dashboard, customer/partner pages, and other admin sections. It replaces the Services screens and adds the missing Django service write endpoints.

## What this update adds

- Create a service from the Admin Portal.
- Edit the name, category, descriptions, pricing, duration, features, add-ons, display order, active status, and top-service flag.
- Search and filter the service catalogue.
- Remove a service from the customer website using archive mode.
- Reactivate an archived service.
- Enforce admin authentication on every service write operation through Django's existing `IsAdminUser` permission.
- Keep the same PostgreSQL `Service` and `Category` tables used by the customer website.

## Important behaviour when removing a service

The Remove button does **not** physically delete the database row. It sets `is_active=False`. The customer's public `/api/services/` endpoint already returns only active services, so the removed service disappears from the public catalogue while any existing booking history can continue referencing it. The Admin Portal can reactivate it later.

## Apply the files

1. Extract this ZIP into the root of your existing Git repository (the folder containing `frontend`, `admin-portal`, and `backend`).
2. Open PowerShell in that repository root.
3. Run the included installer:

```powershell
.\Apply-Service-Update.ps1
```

The installer copies the updated pages and backend endpoint files, creates `.bak` copies before replacing existing files, and appends the service styles only once. You can also copy the files manually; the exact destination paths are listed below.


```text
admin-portal/app/admin/(protected)/services/page.tsx
admin-portal/app/admin/(protected)/services/new/page.tsx
admin-portal/app/admin/(protected)/services/[id]/page.tsx
admin-portal/app/globals.css                 (append the included Service catalogue management CSS)
backend/admin_api/service_views.py           (new file)
backend/admin_api/urls.py                    (replace existing file)
```

The ZIP includes the CSS addition as `admin-portal/app/globals.css.addition.css`. Append its contents to the end of your existing `admin-portal/app/globals.css`; do not replace your entire global stylesheet with the addition file.

## Backend setup

From PowerShell, in the repository root:

```powershell
cd backend
python manage.py check
```

No database migration is needed: this update uses the existing `Service` and `Category` model fields. Restart/redeploy the Django backend after committing the backend files.

## Admin Portal local setup

The repository has a separate Next.js application in `admin-portal` (its local dev server uses port 3001). Create `admin-portal/.env.local`:

```env
NEXT_PUBLIC_CLEANKART_API_URL=https://YOUR-DJANGO-BACKEND-DOMAIN/api
```

Replace the example host with your real deployed Django backend domain. Do not use the customer site's Vercel URL here unless Django is actually hosted on that same domain.

Then:

```powershell
cd admin-portal
npm install
npm run dev
```

Open `http://localhost:3001/admin/services` (sign in first at `http://localhost:3001/admin/login`).

## Deploy to Vercel

Your customer website is `https://ownwash-clone.vercel.app/`. In the repository, the admin application is a separate root folder (`admin-portal`) from the customer app (`frontend`). To deploy this admin app as its own Vercel project, create a Vercel project connected to the same GitHub repository and set:

- Root Directory: `admin-portal`
- Framework: Next.js
- Environment variable: `NEXT_PUBLIC_CLEANKART_API_URL=https://YOUR-DJANGO-BACKEND-DOMAIN/api`

Deploy the Django backend changes first. Then deploy the admin-portal project. Existing Vercel frontend deployment does not automatically include files under the separate `admin-portal` root directory.

## Backend routes added/updated

All routes are mounted below `/api/admin/` and require a signed-in Django user with role `ADMIN`:

| Method | Route | Behaviour |
| --- | --- | --- |
| GET | `/services/` | List all active and archived services for admins |
| POST | `/services/` | Create a service; can create a category if its name does not exist |
| GET | `/services/<id>/` | Read service details |
| PATCH | `/services/<id>/` | Update service fields |
| DELETE | `/services/<id>/` | Archive service by setting `is_active=False` |

The customer-facing `/api/services/` endpoint remains read-only and only lists active services. Changes made in the Admin Portal use the same Django database, so they flow into the customer website after the backend and relevant frontend cache refresh.

## Verify after deployment

1. Sign in with an account whose Django role is `ADMIN`.
2. Open Admin Portal → Services & Pricing.
3. Add a test service with a category, name, and price.
4. Confirm it appears in the admin service list.
5. Open the customer site's services page and confirm the active service appears.
6. Edit the test service's name or price and confirm the updated values are shown.
7. Remove the test service and confirm it disappears from the customer catalogue. It should remain in the Admin Portal under the Archived filter.
8. Reactivate it and confirm it becomes visible again.

If the admin service list shows an API error, verify that `NEXT_PUBLIC_CLEANKART_API_URL` points to the Django host with `/api` appended, and that the Django service has been redeployed with `service_views.py` and the updated `urls.py`.
