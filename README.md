# Meet Yourself Academy

Coaching website for Mwenda Itumbiri (The Meet Yourself Coach & Author) — live
webinars, session recordings, and a books/ebooks shop, with an admin portal to
manage all of it. Built with Next.js (App Router), TypeScript, and Prisma/Postgres.

## Getting started

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (Postgres),
   `JWT_SECRET` (any strong random string — `openssl rand -base64 32`),
   `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` (the first admin login), and
   `BLOB_READ_WRITE_TOKEN` (a [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
   store, for cover-image uploads).
2. Install, migrate, and seed:

   ```bash
   npm install
   npm run db:migrate   # creates the schema
   npm run db:seed      # creates the first admin login + starter content
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) for the site,
[http://localhost:3000/admin](http://localhost:3000/admin) for the admin portal.

Other scripts: `npm run build` (production build + type-check — needs
`DATABASE_URL` reachable, since pages are prerendered against real data),
`npm run start`, `npm run lint`, `npm run db:studio` (Prisma's DB browser).

## Structure

- `app/` — public routes (`/`, `/about`, `/shop`, `/webinars`) plus the
  admin portal under `app/admin/` and API routes under `app/api/`. Shop and
  Webinars each pair a server `page.tsx` (fetches from Prisma) with a
  `*Client.tsx` component holding the interactive state.
- `app/admin/(auth)/login` — public login page. `app/admin/(dashboard)/*` —
  the authenticated portal (webinars, registrations, recordings, books,
  orders, deliveries, subscribers, admin users), protected by `proxy.ts`.
- `app/api/admin/**` — admin CRUD routes (session-guarded). `app/api/{webinars/register,newsletter/subscribe,shop/orders}` —
  the three public-facing write routes the site's forms submit to.
- `components/ui/` — the design-system component library (Button, Badge,
  Card, Input, Select, RadioGroup, Tabs, Dialog, Alert, Avatar, Tag, StatCard).
- `components/site/` — public header/footer/newsletter-form.
- `components/admin/` — admin shell nav, shared table styles, image-upload field.
- `lib/prisma.ts`, `lib/admin-auth.ts`, `lib/storage.ts` — DB client, session
  auth (bcrypt + JWT-in-cookie via `jose`), and Vercel Blob upload wrapper.
- `lib/format.ts` — shared date/price/timezone formatting for DB-backed content.
- `lib/data.ts` / `lib/types.ts` — the few things that stay static: testimonials,
  Kenyan counties, and the mock address-autocomplete places.
- `prisma/schema.prisma` — the data model. `prisma/seed-data.ts` +
  `prisma/seed.ts` — starter content and the first admin login.

## Notes

- **Auth**: email/password only, no public self-registration. The first admin
  comes from the seed; additional admins are created inside the portal at
  `/admin/users` by an already-logged-in admin. There's no self-service
  password reset yet — an admin's password can only be changed by re-running
  the seed logic or a direct DB update.
- **Shop payment stays simulated**: `ShopClient.tsx`'s checkout still mocks
  the M-PESA confirmation (no real gateway wired up), but now persists a real
  `Order` (+ `Delivery` for physical books) that shows up in `/admin/orders`
  and `/admin/deliveries` for manual reconciliation.
- **WhatsApp** in the webinar "join live"/recording flows has no real send
  integration — it's presentational copy only, matching the checkout's
  ebook-delivery-method selector.
- `/shop?buy=<id>` deep-links straight into the checkout dialog for that book
  (read server-side via `searchParams`).
- Uploaded cover images go to Vercel Blob (`lib/storage.ts`); swap that one
  file if you'd rather use S3 or another provider.
