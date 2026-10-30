/**
 * QR payload builders and validation. Pure, isomorphic code — no DOM.
 */

export type QRTypeId = "url" | "text" | "email" | "phone" | "wifi" | "vcard";

export interface QRTypeMeta {
  id: QRTypeId;
  label: string;
  description: string;
}

export const QR_TYPES: QRTypeMeta[] = [
  { id: "url", label: "Website URL", description: "Link to any website" },
  { id: "text", label: "Plain Text", description: "Any message or note" },
  { id: "email", label: "Email", description: "Pre-filled email draft" },
  { id: "phone", label: "Phone Number", description: "One-tap call" },
  { id: "wifi", label: "Wi-Fi", description: "Join a network instantly" },
  { id: "vcard", label: "Contact (vCard)", description: "Share a contact card" },
];

export interface QRFormValues {
  url: string;
  text: string;
  email: { address: string; subject: string; message: string };
  phone: string;
  wifi: {
    ssid: string;
    password: string;
    security: "WPA" | "WEP" | "nopass";
    hidden: boolean;
  };
  vcard: { name: string; phone: string; email: string; organization: string };
}

export function defaultFormValues(): QRFormValues {
  return {
    url: "",
    text: "",
    email: { address: "", subject: "", message: "" },
    phone: "",
    wifi: { ssid: "", password: "", security: "WPA", hidden: false },
    vcard: { name: "", phone: "", email: "", organization: "" },
  };
}

export type BuildResult = { ok: true; data: string } | { ok: false; error: string };

function ok(data: string): BuildResult {
  return { ok: true, data };
}

function fail(error: string): BuildResult {
  return { ok: false, error };
}

/** Escape the special characters defined by the WIFI: URI scheme. */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function buildPayload(type: QRTypeId, v: QRFormValues): BuildResult {
  switch (type) {
    case "url": {
      const raw = v.url.trim();
      if (!raw) return fail("Please enter a website URL.");
      const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(raw)
        ? raw
        : `https://${raw}`;
      try {
        const parsed = new URL(candidate);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          return fail("Only http and https website URLs are supported.");
        }
        return ok(parsed.href);
      } catch {
        return fail("That doesn't look like a valid website URL.");
      }
    }

    case "text": {
      const raw = v.text.trim();
      if (!raw) return fail("Please enter your message.");
      return ok(raw);
    }

    case "email": {
      const address = v.email.address.trim();
      if (!address) return fail("Please enter an email address.");
      if (!isValidEmail(address)) return fail("Please enter a valid email address.");
      const params = new URLSearchParams();
      if (v.email.subject.trim()) params.set("subject", v.email.subject.trim());
      if (v.email.message.trim()) params.set("body", v.email.message.trim());
      const query = params.toString();
      return ok(query ? `mailto:${address}?${query}` : `mailto:${address}`);
    }

    case "phone": {
      const raw = v.phone.trim();
      if (!raw) return fail("Please enter a phone number.");
      if (!/^[+()\-.\s\d]{5,20}$/.test(raw)) {
        return fail("Please enter a valid phone number (digits, spaces, +, -).");
      }
      return ok(`tel:${raw.replace(/[\s()\-\.]/g, "")}`);
    }

    case "wifi": {
      const ssid = v.wifi.ssid.trim();
      if (!ssid) return fail("Please enter the Wi-Fi network name (SSID).");
      const password = v.wifi.password;
      if (v.wifi.security !== "nopass" && !password) {
        return fail("Please enter the Wi-Fi password.");
      }
      const auth = v.wifi.security === "nopass" ? "nopass" : v.wifi.security;
      let payload = `WIFI:T:${auth};S:${escapeWifi(ssid)};`;
      if (auth !== "nopass") payload += `P:${escapeWifi(password)};`;
      if (v.wifi.hidden) payload += "H:true;";
      return ok(`${payload};`);
    }

    case "vcard": {
      const name = v.vcard.name.trim();
      if (!name) return fail("Please enter the contact's name.");
      if (v.vcard.email.trim() && !isValidEmail(v.vcard.email.trim())) {
        return fail("Please enter a valid email address for the contact.");
      }
      const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${name}`];
      const nameParts = name.trim().split(/\s+/);
      if (nameParts.length > 1) {
        lines.push(
          `N:${nameParts[nameParts.length - 1]};${nameParts.slice(0, -1).join(" ")};;;`,
        );
      }
      if (v.vcard.phone.trim()) lines.push(`TEL:${v.vcard.phone.trim()}`);
      if (v.vcard.email.trim()) lines.push(`EMAIL:${v.vcard.email.trim()}`);
      if (v.vcard.organization.trim()) lines.push(`ORG:${v.vcard.organization.trim()}`);
      lines.push("END:VCARD");
      return ok(lines.join("\n"));
    }
  }
}

/** Short human title used in history and filenames. */
export function summarize(type: QRTypeId, data: string): string {
  const clean = data.replace(/\s+/g, " ").trim();
  switch (type) {
    case "url":
      try {
        return new URL(data).hostname.replace(/^www\./, "");
      } catch {
        return clean.slice(0, 32);
      }
    case "text":
      return clean.length > 32 ? `${clean.slice(0, 32)}…` : clean;
    case "email":
      return clean.replace(/^mailto:/, "").split("?")[0];
    case "phone":
      return clean.replace(/^tel:/, "");
    case "wifi":
      return "Wi-Fi network";
    case "vcard":
      return clean.split("\n").find((l) => l.startsWith("FN:"))?.slice(3) ?? "Contact";
  }
}
