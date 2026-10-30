import { useEffect, useRef } from "react";
import { renderQrToCanvas, type QRStyle } from "@/lib/qr";

interface QRCanvasProps {
  text: string;
  style: QRStyle;
  className?: string;
}

/**
 * Draws a live QR code onto a <canvas>. Renders only in the browser
 * (the draw happens in an effect), so SSR output is an empty canvas.
 */
export function QRCanvas({ text, style, className }: QRCanvasProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const { dark, light, size, ecl, logo } = style;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !text) return;
    renderQrToCanvas(canvas, text, style).catch(() => {
      // Rendering failures leave the canvas blank; callers handle validation.
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, dark, light, size, ecl, logo]);

  return <canvas ref={ref} className={className} aria-label="QR code" />;
}
