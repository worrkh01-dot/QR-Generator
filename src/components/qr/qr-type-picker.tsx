import {
  Contact,
  FileText,
  Globe,
  Link2,
  Mail,
  Phone,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QR_TYPES, type QRTypeId } from "@/lib/qr-data";

export const QR_TYPE_ICONS: Record<QRTypeId, LucideIcon> = {
  url: Link2,
  text: FileText,
  email: Mail,
  phone: Phone,
  wifi: Wifi,
  vcard: Contact,
};

interface QRTypePickerProps {
  value: QRTypeId;
  onChange: (id: QRTypeId) => void;
}

export function QRTypePicker({ value, onChange }: QRTypePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {QR_TYPES.map((t) => {
        const Icon = QR_TYPE_ICONS[t.id];
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-pressed={active}
            className={cn(
              "group flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-left transition-all",
              active
                ? "border-primary/60 bg-accent shadow-soft"
                : "border-border bg-card hover:border-primary/40 hover:bg-accent/60",
            )}
          >
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                active
                  ? "text-primary-foreground [background-image:var(--gradient-brand)]"
                  : "bg-secondary text-primary",
              )}
            >
              <Icon className="size-4.5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">
                {t.label}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {t.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { Globe };
