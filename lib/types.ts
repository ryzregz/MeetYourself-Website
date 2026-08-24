// `Book`, `Recording`, and `Webinar` used to be hand-written interfaces here,
// mirroring static arrays in `lib/data.ts`. Both are now database-backed —
// import the Prisma-generated types (`import type { Book, Recording, Webinar }
// from "@prisma/client"`) wherever those shapes are needed instead.

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}
