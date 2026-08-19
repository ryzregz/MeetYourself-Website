export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface Recording {
  id: string;
  cover: string;
  topic: string;
  title: string;
  date: string;
  duration: string;
}

export type BookFormat = "Ebook" | "Physical book";

export interface Book {
  id: string;
  cover: string;
  format: BookFormat;
  /** Badge tone used by the design system's <Badge> component. */
  tone: "brand" | "neutral";
  title: string;
  blurb: string;
  price: string;
  physical: boolean;
}

export interface UpcomingWebinar {
  month: string;
  day: string;
  title: string;
  time: string;
}
