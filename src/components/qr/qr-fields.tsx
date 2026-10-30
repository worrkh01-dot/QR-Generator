import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { defaultFormValues, type QRFormValues, type QRTypeId } from "@/lib/qr-data";

interface QRFieldsProps {
  type: QRTypeId;
  values: QRFormValues;
  onChange: (values: QRFormValues) => void;
}

export function QRFields({ type, values, onChange }: QRFieldsProps) {
  const set = (patch: Partial<QRFormValues>) => onChange({ ...values, ...patch });

  switch (type) {
    case "url":
      return (
        <div className="space-y-2">
          <FieldLabel label="Website URL" hint="https:// is added automatically if missing" />
          <Input
            value={values.url}
            onChange={(e) => set({ url: e.target.value })}
            placeholder="https://example.com"
            inputMode="url"
            autoComplete="off"
          />
        </div>
      );

    case "text":
      return (
        <div className="space-y-2">
          <FieldLabel label="Enter your message" />
          <Textarea
            value={values.text}
            onChange={(e) => set({ text: e.target.value })}
            placeholder="Type anything — a note, a code, a message…"
            rows={4}
          />
        </div>
      );

    case "email":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <FieldLabel label="Email address" />
            <Input
              value={values.email.address}
              onChange={(e) => set({ email: { ...values.email, address: e.target.value } })}
              placeholder="hello@example.com"
              type="email"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Subject" hint="Optional" />
            <Input
              value={values.email.subject}
              onChange={(e) => set({ email: { ...values.email, subject: e.target.value } })}
              placeholder="What is this about?"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Message" hint="Optional" />
            <Textarea
              value={values.email.message}
              onChange={(e) => set({ email: { ...values.email, message: e.target.value } })}
              placeholder="Pre-written message…"
              rows={3}
            />
          </div>
        </div>
      );

    case "phone":
      return (
        <div className="space-y-2">
          <FieldLabel label="Phone number" hint="Include the country code for international numbers" />
          <Input
            value={values.phone}
            onChange={(e) => set({ phone: e.target.value })}
            placeholder="+91 98765 43210"
            inputMode="tel"
            autoComplete="off"
          />
        </div>
      );

    case "wifi":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <FieldLabel label="Network name (SSID)" />
            <Input
              value={values.wifi.ssid}
              onChange={(e) => set({ wifi: { ...values.wifi, ssid: e.target.value } })}
              placeholder="Home-WiFi"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Password" hint="Leave empty for open networks" />
            <Input
              value={values.wifi.password}
              onChange={(e) => set({ wifi: { ...values.wifi, password: e.target.value } })}
              placeholder="••••••••"
              disabled={values.wifi.security === "nopass"}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel label="Security type" />
              <Select
                value={values.wifi.security}
                onValueChange={(v) =>
                  set({
                    wifi: {
                      ...values.wifi,
                      security: v as QRFormValues["wifi"]["security"],
                    },
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA / WPA2 / WPA3</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">None (open network)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-end gap-3 pb-1">
              <Switch
                checked={values.wifi.hidden}
                onCheckedChange={(checked) => set({ wifi: { ...values.wifi, hidden: checked } })}
                aria-label="Hidden network"
              />
              <span className="text-sm text-muted-foreground">Hidden network</span>
            </label>
          </div>
        </div>
      );

    case "vcard":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <FieldLabel label="Full name" />
            <Input
              value={values.vcard.name}
              onChange={(e) => set({ vcard: { ...values.vcard, name: e.target.value } })}
              placeholder="Ada Lovelace"
              autoComplete="off"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel label="Phone number" hint="Optional" />
              <Input
                value={values.vcard.phone}
                onChange={(e) => set({ vcard: { ...values.vcard, phone: e.target.value } })}
                placeholder="+91 98765 43210"
                inputMode="tel"
              />
            </div>
            <div className="space-y-2">
              <FieldLabel label="Email" hint="Optional" />
              <Input
                value={values.vcard.email}
                onChange={(e) => set({ vcard: { ...values.vcard, email: e.target.value } })}
                placeholder="ada@example.com"
                type="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <FieldLabel label="Organization" hint="Optional" />
            <Input
              value={values.vcard.organization}
              onChange={(e) =>
                set({ vcard: { ...values.vcard, organization: e.target.value } })
              }
              placeholder="Company or team"
            />
          </div>
        </div>
      );
  }
}

function FieldLabel({
  label,
  hint,
  icon: Icon,
}: {
  label: string;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-1">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </div>
  );
}

export { defaultFormValues };
