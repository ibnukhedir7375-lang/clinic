import { CURRENCY } from "../config/clinic";

export const formatMoney = (amount) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: CURRENCY }).format(amount ?? 0);

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "—";

export const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—";

// "2026-10-19T08:00:00Z" -> "25 min ago"
export function timeAgo(iso) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return formatDate(iso);
}

export const formatPhone = (phone = "") => phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");

export const initials = (name = "") =>
  name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const capitalize = (text = "") => text.charAt(0).toUpperCase() + text.slice(1);
