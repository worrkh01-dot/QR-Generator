/**
 * QR rendering + download helpers.
 *
 * The `qrcode` package is dynamically imported inside every function so it
 * never enters the server/SSR (workerd) module graph — all of these run in
 * browser event handlers or effects only.
 */

export type ECLevel = "L" | "M" | "Q" | "H";

export interface QRStyle {
  /** Module (dot) color as any CSS color string. */
  dark: string;
  /** Background color. */
  light: string;
  /** Rendered width in px. */
  size: number;
  ecl: ECLevel;
  /** Optional data URL for a center logo. */
  logo: string | null;
}

export const DEFAULT_QR_STYLE: QRStyle = {
  dark: "#6C4CEB",
  light: "#FFFFFF",
  size: 384,
  ecl: "M",
  logo: null,
};

export const SIZE_OPTIONS = [
  { key: "small", label: "Small", px: 256 },
  { key: "medium", label: "Medium", px: 384 },
  { key: "large", label: "Large", px: 512 },
] as const;

export const COLOR_PRESETS = [
  { dark: "#6C4CEB", light: "#FFFFFF" },
  { dark: "#4776E6", light: "#FFFFFF" },
  { dark: "#111827", light: "#FFFFFF" },
  { dark: "#0F766E", light: "#FFFFFF" },
  { dark: "#B91C1C", light: "#FFFFFF" },
  { dark: "#FFFFFF", light: "#6C4CEB" },
] as const;

export const MAX_LOGO_BYTES = 150 * 1024;

const LOGO_BOX = 0.24;
const LOGO_PAD = 0.02;

async function loadQrcode() {
  const mod = await import("qrcode");
  return mod.default;
}

function drawLogoOnCanvas(canvas: HTMLCanvasElement, logo: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve();
      const s = canvas.width;
      const box = s * LOGO_BOX;
      const pad = s * LOGO_PAD;
      const x = (s - box) / 2;
      const bw = box + pad * 2;
      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(x - pad, x - pad, bw, bw, bw * 0.2);
      ctx.fill();
      const scale = Math.min(box / img.width, box / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, x + (box - dw) / 2, x + (box - dh) / 2, dw, dh);
      ctx.restore();
      resolve();
    };
    img.onerror = () => reject(new Error("Could not load the logo image"));
    img.src = logo;
  });
}

/** Draw the QR code (plus optional logo) onto a canvas element. */
export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  style: QRStyle,
): Promise<void> {
  const QRCode = await loadQrcode();
  await QRCode.toCanvas(canvas, text, {
    width: style.size,
    margin: 2,
    errorCorrectionLevel: style.logo ? "H" : style.ecl,
    color: { dark: style.dark, light: style.light },
  });
  if (style.logo) await drawLogoOnCanvas(canvas, style.logo);
}

/** Render off-screen at full size and export as a PNG blob. */
export async function qrToPngBlob(text: string, style: QRStyle): Promise<Blob> {
  const QRCode = await loadQrcode();
  const canvas = document.createElement("canvas");
  await renderQrToCanvas(canvas, text, style);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not export PNG"))),
      "image/png",
    ),
  );
}

/** Build a standalone SVG string (logo embedded when provided). */
export async function qrToSvgString(text: string, style: QRStyle): Promise<string> {
  const QRCode = await loadQrcode();
  const svg = await QRCode.toString(text, {
    type: "svg",
    width: style.size,
    margin: 2,
    errorCorrectionLevel: style.logo ? "H" : style.ecl,
    color: { dark: style.dark, light: style.light },
  });
  if (!style.logo) return svg;
  const match = /viewBox="0 0 ([\d.]+)/.exec(svg);
  const w = match ? Number(match[1]) : style.size;
  const box = w * LOGO_BOX;
  const pad = w * LOGO_PAD;
  const x = (w - box) / 2;
  const bw = box + pad * 2;
  const overlay =
    `<rect x="${x - pad}" y="${x - pad}" width="${bw}" height="${bw}" ` +
    `rx="${bw * 0.2}" fill="#FFFFFF"/>` +
    `<image x="${x}" y="${x}" width="${box}" height="${box}" href="${style.logo}" ` +
    `preserveAspectRatio="xMidYMid meet"/>`;
  return svg.replace("</svg>", `${overlay}</svg>`);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function downloadQrPng(text: string, style: QRStyle, filename: string) {
  downloadBlob(await qrToPngBlob(text, style), `${filename}.png`);
}

export async function downloadQrSvg(text: string, style: QRStyle, filename: string) {
  const svg = await qrToSvgString(text, style);
  downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `${filename}.svg`);
}

export function safeFilename(value: string): string {
  const cleaned = value
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return cleaned || "qrify-code";
}

export async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}
