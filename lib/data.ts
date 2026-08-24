import type { Testimonial } from "./types";

// Recordings, books, and upcoming webinars now live in the database (see
// prisma/schema.prisma and the admin portal at /admin) — their old static
// arrays moved to prisma/seed-data.ts, used only to seed a fresh database.
//
// These three stay static: no admin section manages them, and the address
// autocomplete is an intentional mock (no Google Places key configured).

/** Shared by Home and About. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "I finally understood why the labels I used for myself mattered so much. This changed how I speak to myself daily.",
    name: "Grace Wanjiru",
    role: "Webinar attendee",
  },
  {
    quote:
      "Mwenda has a way of making you see your own patterns clearly, without judgment. Practical and grounding.",
    name: "Brian Otieno",
    role: "Book reader",
  },
  {
    quote:
      "The webinars are consistent, honest, and never rushed. I look forward to every session.",
    name: "Faith Nyambura",
    role: "Academy member",
  },
];

/** Kenyan counties offered in the Shop checkout's delivery-address form. */
export const kenyanCounties = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Uasin Gishu",
  "Kiambu",
  "Machakos",
  "Other",
];

/** Mock places for the Shop checkout's address autocomplete. */
export const mockPlaces = [
  { label: "Kilimani, Nairobi", coords: "-1.2921, 36.7872" },
  { label: "Westlands, Nairobi", coords: "-1.2648, 36.8027" },
  { label: "Karen, Nairobi", coords: "-1.3194, 36.7085" },
  { label: "Nyali, Mombasa", coords: "-4.0296, 39.7076" },
  { label: "Milimani, Kisumu", coords: "-0.1022, 34.7617" },
  { label: "Section 58, Eldoret", coords: "0.5143, 35.2698" },
];
