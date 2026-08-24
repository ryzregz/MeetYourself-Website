// Shared display formatting for DB-backed content — keeps every page's
// date/price rendering consistent instead of re-deriving it per component.

const NAIROBI_TZ = "Africa/Nairobi";
// Kenya has no DST — a fixed +03:00 offset applies year-round, which is what
// makes the two helpers below safe to compute with plain arithmetic/string
// concatenation instead of a full timezone library.
const NAIROBI_OFFSET_MS = 3 * 60 * 60 * 1000;

/** For an <input type="datetime-local"> value/defaultValue, read as Nairobi wall-clock time. */
export function toNairobiDatetimeLocal(date: Date): string {
  return new Date(date.getTime() + NAIROBI_OFFSET_MS).toISOString().slice(0, 16);
}

/** Inverse of `toNairobiDatetimeLocal` — parses an <input type="datetime-local"> value (e.g. "2026-09-01T19:00") as Nairobi wall-clock time into a real instant, regardless of the admin's own browser timezone. */
export function fromNairobiDatetimeLocal(value: string): Date {
  return new Date(`${value}:00+03:00`);
}

export function formatKes(amountKes: number): string {
  return `KES ${amountKes.toLocaleString("en-US")}`;
}

/** Recordings only store a calendar date, not a meaningful time-of-day — format in UTC so a seeded midnight timestamp can't drift to the previous day in a negative-offset environment. */
export function formatRecordingDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

/** For an <input type="date"> value/defaultValue — same UTC convention as `formatRecordingDate`. */
export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Inverse of `toDateInputValue`. */
export function fromDateInputValue(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

/** "AUG" / "4" — the date-box on an upcoming-webinar card, always read in the venue's own timezone (EAT). */
export function formatMonthDay(date: Date): { month: string; day: string } {
  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short", timeZone: NAIROBI_TZ }).format(date).toUpperCase(),
    day: new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: NAIROBI_TZ }).format(date),
  };
}

/** "Tue, Aug 4 2026" / "7:00 PM" / the combined "Tue, Aug 4 2026 · 7:00 PM EAT" — all in EAT regardless of server timezone. */
export function formatWebinarSchedule(date: Date): { datePart: string; timePart: string; combined: string } {
  const datePart = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: NAIROBI_TZ,
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: NAIROBI_TZ,
  }).format(date);
  return { datePart, timePart, combined: `${datePart} · ${timePart} EAT` };
}
