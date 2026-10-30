import { useRef } from "react";
import { ImagePlus, Palette, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  COLOR_PRESETS,
  MAX_LOGO_BYTES,
  SIZE_OPTIONS,
  type ECLevel,
  type QRStyle,
} from "@/lib/qr";

interface QRCustomizerProps {
  style: QRStyle;
  onChange: (style: QRStyle) => void;
}

const ECL_OPTIONS: { value: ECLevel; label: string; hint: string }[] = [
  { value: "L", label: "L — Low", hint: "~7% recoverable" },
  { value: "M", label: "M — Medium", hint: "~15% recoverable" },
  { value: "Q", label: "Q — Quartile", hint: "~25% recoverable" },
  { value: "H", label: "H — High", hint: "~30% recoverable" },
];

export function QRCustomizer({ style, onChange }: QRCustomizerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > MAX_LOGO_BYTES) {
      onChange(style);
      fileRef.current && (fileRef.current.value = "");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange({ ...style, logo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      {/* Colors */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="size-4 text-primary" />
          <Label className="text-sm font-semibold text-foreground">Colors</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((p) => (
            <button
              key={`${p.dark}-${p.light}`}
              type="button"
              aria-label={`Colors: ${p.dark} on ${p.light}`}
              onClick={() => onChange({ ...style, dark: p.dark, light: p.light })}
              className={cn(
                "flex cursor-pointer items-center gap-1 rounded-full border p-1 pr-2.5 transition-all hover:border-primary/50",
                style.dark === p.dark && style.light === p.light
                  ? "border-primary shadow-soft"
                  : "border-border",
              )}
            >
              <span
                className="size-5 rounded-full border border-black/10"
                style={{ background: p.dark }}
              />
              <span
                className="-ml-1.5 size-5 rounded-full border border-black/10"
                style={{ background: p.light }}
              />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="color"
              value={toHex(style.dark)}
              onChange={(e) => onChange({ ...style, dark: e.target.value })}
              className="size-8 cursor-pointer rounded-md border border-border bg-card p-0.5"
              aria-label="Foreground color"
            />
            Foreground
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="color"
              value={toHex(style.light)}
              onChange={(e) => onChange({ ...style, light: e.target.value })}
              className="size-8 cursor-pointer rounded-md border border-border bg-card p-0.5"
              aria-label="Background color"
            />
            Background
          </label>
        </div>
      </div>

      {/* Size */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">Size</Label>
        <div className="grid grid-cols-3 gap-2">
          {SIZE_OPTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onChange({ ...style, size: s.px })}
              className={cn(
                "cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                style.size === s.px
                  ? "border-primary bg-accent text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent/60",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error correction */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <Label className="text-sm font-semibold text-foreground">Error correction</Label>
          <span className="text-xs text-muted-foreground">
            Higher = more damage-proof, denser code
          </span>
        </div>
        <Select
          value={style.ecl}
          onValueChange={(v) => onChange({ ...style, ecl: v as ECLevel })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ECL_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                <span className="font-medium">{o.label}</span>
                <span className="ml-2 text-xs text-muted-foreground">{o.hint}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Logo */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <Label className="text-sm font-semibold text-foreground">Center logo</Label>
          <span className="text-xs text-muted-foreground">Max 150 KB · error correction set to High</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleLogoFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <ImagePlus />
            {style.logo ? "Replace logo" : "Upload logo"}
          </Button>
          {style.logo ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange({ ...style, logo: null })}
            >
              <Trash2 />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function toHex(value: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
}
