/**
 * TableTurn AI – Shared utility functions
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  formatDistanceToNow,
  isValid,
  parseISO,
} from "date-fns";

// ─────────────────────────────────────────────
// Styling
// ─────────────────────────────────────────────

/**
 * Merges class names using clsx + tailwind-merge.
 * Handles conditional classes and deduplicates conflicting Tailwind utilities.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", "bg-red-500")
 * // => "px-4 py-2 bg-red-500"  (bg-red-500 wins via tailwind-merge)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────
// Date Formatting
// ─────────────────────────────────────────────

/**
 * Formats a date value as a human-readable string.
 * Accepts Date objects, ISO strings, or timestamps.
 *
 * @example
 * formatDate(new Date())          // "Apr 9, 2026"
 * formatDate("2025-12-25")        // "Dec 25, 2025"
 * formatDate(date, "MM/dd/yyyy")  // "04/09/2026"
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  pattern: string = "MMM d, yyyy"
): string {
  if (!date) return "—";

  let d: Date;
  if (typeof date === "string") {
    d = parseISO(date);
  } else {
    d = new Date(date);
  }

  if (!isValid(d)) return "—";
  return format(d, pattern);
}

/**
 * Formats a date as a relative time string.
 *
 * @example
 * formatRelativeDate(new Date(Date.now() - 3600_000)) // "about 1 hour ago"
 */
export function formatRelativeDate(
  date: Date | string | number | null | undefined
): string {
  if (!date) return "—";

  let d: Date;
  if (typeof date === "string") {
    d = parseISO(date);
  } else {
    d = new Date(date);
  }

  if (!isValid(d)) return "—";
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Formats a date for datetime-local inputs (YYYY-MM-DDTHH:mm).
 */
export function formatDateTimeLocal(
  date: Date | string | null | undefined
): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "";
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

// ─────────────────────────────────────────────
// Currency & Number Formatting
// ─────────────────────────────────────────────

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Formats a number as USD currency.
 *
 * @example
 * formatCurrency(1234.5)   // "$1,234.50"
 * formatCurrency(5000)     // "$5,000"
 * formatCurrency(null)     // "$0"
 */
export function formatCurrency(
  amount: number | string | null | undefined
): string {
  if (amount == null) return "$0";
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(n)) return "$0";
  return usdFormatter.format(n);
}

const numberFormatter = new Intl.NumberFormat("en-US");

/**
 * Formats a number with thousands separators.
 *
 * @example
 * formatNumber(1234567)  // "1,234,567"
 */
export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "0";
  return numberFormatter.format(n);
}

/**
 * Formats a decimal as a percentage string.
 *
 * @example
 * formatPercent(0.2345)  // "23.45%"
 * formatPercent(0.5, 0)  // "50%"
 */
export function formatPercent(
  value: number | null | undefined,
  decimals: number = 1
): string {
  if (value == null) return "0%";
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Abbreviates large numbers for compact display.
 *
 * @example
 * formatCompactNumber(1234567)  // "1.2M"
 * formatCompactNumber(45000)    // "45K"
 */
export function formatCompactNumber(n: number | null | undefined): string {
  if (n == null) return "0";
  if (Math.abs(n) >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(n) >= 1_000) {
    return `${(n / 1_000).toFixed(1)}K`;
  }
  return String(n);
}

// ─────────────────────────────────────────────
// String Utilities
// ─────────────────────────────────────────────

/**
 * Generates a URL-friendly slug from a string.
 *
 * @example
 * generateSlug("Rosewood Kitchen & Bar")  // "rosewood-kitchen-bar"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "")   // remove non-alphanumeric except spaces/hyphens
    .trim()
    .replace(/\s+/g, "-")            // spaces to hyphens
    .replace(/-+/g, "-")             // collapse consecutive hyphens
    .replace(/^-|-$/g, "");          // strip leading/trailing hyphens
}

/**
 * Truncates a string to the given length, appending "…" if truncated.
 *
 * @example
 * truncate("A long description", 10)  // "A long de…"
 */
export function truncate(
  str: string | null | undefined,
  length: number
): string {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length - 1) + "…";
}

/**
 * Returns initials from a full name (up to 2 characters).
 *
 * @example
 * getInitials("Jane Smith")    // "JS"
 * getInitials("Madonna")       // "M"
 * getInitials("Mary Jo Webb")  // "MW"  (first + last)
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Returns a pluralized word based on count.
 *
 * @example
 * pluralize(1, "guest")   // "1 guest"
 * pluralize(5, "guest")   // "5 guests"
 * pluralize(0, "result")  // "0 results"
 */
export function pluralize(
  count: number,
  word: string,
  plural?: string
): string {
  const suffix = plural ?? `${word}s`;
  return `${formatNumber(count)} ${count === 1 ? word : suffix}`;
}

/**
 * Capitalizes the first letter of each word.
 *
 * @example
 * titleCase("hello world")  // "Hello World"
 */
export function titleCase(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Converts a snake_case or SCREAMING_CASE string to "Title Case".
 *
 * @example
 * enumToLabel("MARKETING_MANAGER")  // "Marketing Manager"
 */
export function enumToLabel(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Checks if an email address has a valid format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Strips HTML tags from a string.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

// ─────────────────────────────────────────────
// Misc
// ─────────────────────────────────────────────

/**
 * Generates a random hex color string.
 */
export function randomColor(): string {
  const colors = [
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#f43f5e", // rose
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#14b8a6", // teal
    "#3b82f6", // blue
    "#06b6d4", // cyan
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Sleeps for a given number of milliseconds. Useful in seed scripts.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
