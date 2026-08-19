import type { Book, Recording, Testimonial, UpcomingWebinar } from "./types";

/** Shared across Home ("recent recordings", first 3) and Webinars ("recordings library", all 10). */
export const recordings: Recording[] = [
  {
    id: "rec-1",
    cover: "/assets/webinar-1.png",
    topic: "Coaching Session",
    title: "Mindset Shift and Why It Matters",
    date: "Jul 21, 2026",
    duration: "52 min",
  },
  {
    id: "rec-2",
    cover: "/assets/webinar-2.png",
    topic: "Coaching Session",
    title: "Excuses Audit",
    date: "Jul 7, 2026",
    duration: "48 min",
  },
  {
    id: "rec-3",
    cover: "/assets/webinar-3.png",
    topic: "Coaching Session",
    title: "The Life YOU Inherited",
    date: "Jun 23, 2026",
    duration: "55 min",
  },
  {
    id: "rec-4",
    cover: "/assets/webinar-4.png",
    topic: "Coaching Session",
    title: "Discover The Purpose M.E.E.T Model",
    date: "Jun 9, 2026",
    duration: "50 min",
  },
  {
    id: "rec-5",
    cover: "/assets/webinar-5.png",
    topic: "Coaching Session",
    title: "Know Your Reds, Your Ambers and Your Greens",
    date: "May 26, 2026",
    duration: "47 min",
  },
  {
    id: "rec-6",
    cover: "/assets/webinar-6.png",
    topic: "Coaching Session",
    title: "Whatever You Call It, That Is What It Is",
    date: "May 12, 2026",
    duration: "58 min",
  },
  {
    id: "rec-7",
    cover: "/assets/webinar-7.png",
    topic: "Coaching Session",
    title: "Meet Yourself: The Leader Without a Title",
    date: "Apr 28, 2026",
    duration: "54 min",
  },
  {
    id: "rec-8",
    cover: "/assets/webinar-8.png",
    topic: "Coaching Session",
    title: "Leader, If You Solve Same Problem Twice, You Are the Problem!",
    date: "Apr 14, 2026",
    duration: "49 min",
  },
  {
    id: "rec-9",
    cover: "/assets/webinar-9.png",
    topic: "Coaching Session",
    title: "Meet Yourself: Who Carries the Strong?",
    date: "Mar 31, 2026",
    duration: "56 min",
  },
  {
    id: "rec-10",
    cover: "/assets/webinar-10.png",
    topic: "Coaching Session",
    title: "Who Would You Be If You Confronted Your Fear",
    date: "Mar 17, 2026",
    duration: "51 min",
  },
];

/** Full shop catalog. Home's "featured" preview shows the first 3. */
export const books: Book[] = [
  {
    id: "shop-1",
    cover: "/assets/book-cover.jpg",
    format: "Ebook",
    tone: "brand",
    title:
      "Meet Yourself: The Ultimate Guide to Self-Discovery and Unveiling the Greatness in YOU",
    blurb:
      "A transformative journey of deep reflection, honest confrontation, and powerful awakening. Instant delivery after payment.",
    price: "KES 800",
    physical: false,
  },
  {
    id: "shop-2",
    cover: "/assets/book-cover.jpg",
    format: "Physical book",
    tone: "neutral",
    title:
      "Meet Yourself: The Ultimate Guide to Self-Discovery and Unveiling the Greatness in YOU",
    blurb: "Paperback edition, delivered to your door. ISBN 978-9914-9482-7-1.",
    price: "KES 2,200",
    physical: true,
  },
  {
    id: "shop-3",
    cover: "/assets/book-cover.jpg",
    format: "Ebook",
    tone: "brand",
    title: "Reclaim Your Power: Journal Edition",
    blurb: "Guided prompts and reflection exercises.",
    price: "KES 600",
    physical: false,
  },
  {
    id: "shop-4",
    cover: "/assets/book-cover.jpg",
    format: "Physical book",
    tone: "neutral",
    title: "Reclaim Your Power: Journal Edition",
    blurb: "Printed journal with guided prompts.",
    price: "KES 1,800",
    physical: true,
  },
  {
    id: "shop-5",
    cover: "/assets/book-cover.jpg",
    format: "Ebook",
    tone: "brand",
    title: "Design Your Life: A Field Guide",
    blurb: "Companion ebook to the webinar series.",
    price: "KES 750",
    physical: false,
  },
  {
    id: "shop-6",
    cover: "/assets/book-cover.jpg",
    format: "Physical book",
    tone: "neutral",
    title: "Design Your Life: A Field Guide",
    blurb: "Hardcover edition, signed on request.",
    price: "KES 2,500",
    physical: true,
  },
];

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

export const upcomingWebinars: UpcomingWebinar[] = [
  {
    month: "AUG",
    day: "4",
    title: "Whatever You Call It, That Is What It Is",
    time: "Tue, Aug 4 2026 · 7:00 PM EAT",
  },
  {
    month: "AUG",
    day: "18",
    title: "Q&A: Naming Your Reality, Six Months In",
    time: "Tue, Aug 18 2026 · 7:00 PM EAT",
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
