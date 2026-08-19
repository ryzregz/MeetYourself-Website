# Meet Yourself Academy

Coaching website for Mwenda Itumbiri (The Meet Yourself Coach & Author) — live
webinars, session recordings, and a books/ebooks shop. Built with Next.js
(App Router) and TypeScript.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build` (production build + type-check), `npm run start`
(serve the production build), `npm run lint` (ESLint).

## Structure

- `app/` — routes: `/` (Home), `/about`, `/shop`, `/webinars`. Shop and
  Webinars each pair a server `page.tsx` with a `*Client.tsx` component that
  holds the interactive state (checkout flow, tabs, recording player).
- `components/ui/` — a small design-system component library (Button, Badge,
  Card, Input, Select, RadioGroup, Tabs, Dialog, Alert, Avatar, Tag, StatCard),
  each using the CSS custom-property tokens defined in `app/globals.css`.
- `components/site/` — shared header/footer chrome rendered from
  `app/layout.tsx`.
- `lib/data.ts` / `lib/types.ts` — site content (books, recordings,
  testimonials, upcoming webinars) as typed data, shared across pages.
- `public/assets/` — images (logo, coach photo, book cover, webinar
  thumbnails).

## Notes

- The Shop checkout (M-PESA STK push / paybill, Kenya address autocomplete) is
  a UI-only mock — `ShopClient.tsx`'s `confirmPayment` simulates a payment
  with a timeout instead of calling a real payment provider.
- `/shop?buy=<id>` deep-links straight into the checkout dialog for that book
  (read server-side via `searchParams`).
