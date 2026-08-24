// Initial content for a fresh database, carried over from the site's original
// static `lib/data.ts` so nothing authored earlier is lost. Only `prisma/seed.ts`
// imports this — the app itself now reads everything from the database.

export const seedWebinars = [
  {
    title: "Whatever You Call It, That Is What It Is",
    description:
      "How to name your reality so it stops running you — with Mwenda Itumbiri, The Meet Yourself Coach & Author.",
    startsAt: new Date("2026-09-01T19:00:00+03:00"),
    durationMin: 60,
  },
  {
    title: "Q&A: Naming Your Reality, Six Months In",
    description: null,
    startsAt: new Date("2026-09-15T19:00:00+03:00"),
    durationMin: 60,
  },
];

export const seedRecordings = [
  {
    title: "Mindset Shift and Why It Matters",
    topic: "Coaching Session",
    recordedAt: new Date("2026-07-21"),
    durationLabel: "52 min",
    coverUrl: "/assets/webinar-1.png",
  },
  {
    title: "Excuses Audit",
    topic: "Coaching Session",
    recordedAt: new Date("2026-07-07"),
    durationLabel: "48 min",
    coverUrl: "/assets/webinar-2.png",
  },
  {
    title: "The Life YOU Inherited",
    topic: "Coaching Session",
    recordedAt: new Date("2026-06-23"),
    durationLabel: "55 min",
    coverUrl: "/assets/webinar-3.png",
  },
  {
    title: "Discover The Purpose M.E.E.T Model",
    topic: "Coaching Session",
    recordedAt: new Date("2026-06-09"),
    durationLabel: "50 min",
    coverUrl: "/assets/webinar-4.png",
  },
  {
    title: "Know Your Reds, Your Ambers and Your Greens",
    topic: "Coaching Session",
    recordedAt: new Date("2026-05-26"),
    durationLabel: "47 min",
    coverUrl: "/assets/webinar-5.png",
  },
  {
    title: "Whatever You Call It, That Is What It Is",
    topic: "Coaching Session",
    recordedAt: new Date("2026-05-12"),
    durationLabel: "58 min",
    coverUrl: "/assets/webinar-6.png",
  },
  {
    title: "Meet Yourself: The Leader Without a Title",
    topic: "Coaching Session",
    recordedAt: new Date("2026-04-28"),
    durationLabel: "54 min",
    coverUrl: "/assets/webinar-7.png",
  },
  {
    title: "Leader, If You Solve Same Problem Twice, You Are the Problem!",
    topic: "Coaching Session",
    recordedAt: new Date("2026-04-14"),
    durationLabel: "49 min",
    coverUrl: "/assets/webinar-8.png",
  },
  {
    title: "Meet Yourself: Who Carries the Strong?",
    topic: "Coaching Session",
    recordedAt: new Date("2026-03-31"),
    durationLabel: "56 min",
    coverUrl: "/assets/webinar-9.png",
  },
  {
    title: "Who Would You Be If You Confronted Your Fear",
    topic: "Coaching Session",
    recordedAt: new Date("2026-03-17"),
    durationLabel: "51 min",
    coverUrl: "/assets/webinar-10.png",
  },
];

export const seedBooks = [
  {
    title: "Meet Yourself: The Ultimate Guide to Self-Discovery and Unveiling the Greatness in YOU",
    format: "Ebook",
    physical: false,
    tone: "brand",
    priceKes: 800,
    blurb:
      "A transformative journey of deep reflection, honest confrontation, and powerful awakening. Instant delivery after payment.",
    coverUrl: "/assets/book-cover.jpg",
  },
  {
    title: "Meet Yourself: The Ultimate Guide to Self-Discovery and Unveiling the Greatness in YOU",
    format: "Physical book",
    physical: true,
    tone: "neutral",
    priceKes: 2200,
    blurb: "Paperback edition, delivered to your door. ISBN 978-9914-9482-7-1.",
    coverUrl: "/assets/book-cover.jpg",
  },
  {
    title: "Reclaim Your Power: Journal Edition",
    format: "Ebook",
    physical: false,
    tone: "brand",
    priceKes: 600,
    blurb: "Guided prompts and reflection exercises.",
    coverUrl: "/assets/book-cover.jpg",
  },
  {
    title: "Reclaim Your Power: Journal Edition",
    format: "Physical book",
    physical: true,
    tone: "neutral",
    priceKes: 1800,
    blurb: "Printed journal with guided prompts.",
    coverUrl: "/assets/book-cover.jpg",
  },
  {
    title: "Design Your Life: A Field Guide",
    format: "Ebook",
    physical: false,
    tone: "brand",
    priceKes: 750,
    blurb: "Companion ebook to the webinar series.",
    coverUrl: "/assets/book-cover.jpg",
  },
  {
    title: "Design Your Life: A Field Guide",
    format: "Physical book",
    physical: true,
    tone: "neutral",
    priceKes: 2500,
    blurb: "Hardcover edition, signed on request.",
    coverUrl: "/assets/book-cover.jpg",
  },
];
