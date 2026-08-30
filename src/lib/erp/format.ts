import type { CurrencyCode } from "@/types/erp";

const SYMBOLS: Record<CurrencyCode, string> = {
  ZAR: "R",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const decimalFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const compactNumberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Formats money in the NEXORA house style, e.g. `R 1,284,500.00`. */
export function formatMoney(amount: number, currency: CurrencyCode = "ZAR"): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}${SYMBOLS[currency]} ${decimalFormatter.format(Math.abs(amount))}`;
}

/** Shortened money for dense widgets, e.g. `R 1.28m`. */
export function formatMoneyCompact(amount: number, currency: CurrencyCode = "ZAR"): string {
  const symbol = SYMBOLS[currency];
  const sign = amount < 0 ? "-" : "";
  const value = Math.abs(amount);
  if (value >= 1_000_000_000) return `${sign}${symbol} ${(value / 1_000_000_000).toFixed(2)}bn`;
  if (value >= 1_000_000) return `${sign}${symbol} ${(value / 1_000_000).toFixed(2)}m`;
  if (value >= 1_000) return `${sign}${symbol} ${(value / 1_000).toFixed(1)}k`;
  return `${sign}${symbol} ${value.toFixed(2)}`;
}

export function formatNumber(value: number): string {
  return compactNumberFormatter.format(value);
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatSignedPercent(value: number, fractionDigits = 1): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(fractionDigits)}%`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Formats an ISO date (yyyy-mm-dd) as `24 Jun 2026` without locale drift between server and client. */
export function formatDate(iso: string): string {
  if (!iso || iso === "—") return "—";
  const [year, month, day] = iso.slice(0, 10).split("-");
  const monthIndex = Number(month) - 1;
  if (Number.isNaN(monthIndex) || !MONTHS[monthIndex]) return iso;
  return `${Number(day)} ${MONTHS[monthIndex]} ${year}`;
}

export function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const datePart = formatDate(iso);
  const timePart = iso.includes("T") ? iso.slice(11, 16) : "";
  return timePart ? `${datePart}, ${timePart}` : datePart;
}

const REFERENCE_NOW = new Date("2026-06-30T09:00:00.000Z").getTime();

export function formatRelative(iso: string): string {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "—";
  const diffMinutes = Math.round((REFERENCE_NOW - time) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const hours = Math.round(diffMinutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return formatDate(iso);
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
