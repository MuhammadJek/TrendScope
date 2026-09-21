import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: value >= 10000 ? 1 : 0,
  }).format(value);
}

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function toTitleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getRelativeFreshness(isoDate: string) {
  const captured = new Date(isoDate).getTime();
  const now = new Date("2026-09-21T00:00:00.000Z").getTime();
  const days = Math.max(0, Math.round((now - captured) / 86400000));

  if (days === 0) {
    return "Updated today";
  }

  if (days === 1) {
    return "Updated yesterday";
  }

  return `Updated ${days} days ago`;
}
