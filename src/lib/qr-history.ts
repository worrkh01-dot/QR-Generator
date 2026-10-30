import type { QRTypeId } from "./qr-data";
import type { QRStyle } from "./qr";

export interface QRHistoryEntry {
  id: string;
  type: QRTypeId;
  title: string;
  data: string;
  style: QRStyle;
  createdAt: number;
}

const STORAGE_KEY = "qrify:history:v1";
const MAX_ENTRIES = 60;

function isEntry(value: unknown): value is QRHistoryEntry {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.type === "string" &&
    typeof e.title === "string" &&
    typeof e.data === "string" &&
    typeof e.createdAt === "number" &&
    !!e.style &&
    typeof e.style === "object"
  );
}

export function loadHistory(): QRHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isEntry);
  } catch {
    return [];
  }
}

export function persistHistory(entries: QRHistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entries.slice(0, MAX_ENTRIES)),
    );
  } catch {
    // Storage full or unavailable — history simply won't persist.
  }
}

export function addHistoryEntry(entry: QRHistoryEntry): QRHistoryEntry[] {
  const next = [entry, ...loadHistory()].slice(0, MAX_ENTRIES);
  persistHistory(next);
  return next;
}

export function removeHistoryEntry(id: string): QRHistoryEntry[] {
  const next = loadHistory().filter((e) => e.id !== id);
  persistHistory(next);
  return next;
}

export function clearAllHistory(): QRHistoryEntry[] {
  persistHistory([]);
  return [];
}
