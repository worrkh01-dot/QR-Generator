import { describe, expect, it } from "vitest";
import {
  buildPayload,
  defaultFormValues,
  QR_TYPES,
  summarize,
} from "@/lib/qr-data";

describe("QR payload builders", () => {
  it("covers the six advertised QR types", () => {
    expect(QR_TYPES.map((t) => t.id)).toEqual([
      "url",
      "text",
      "email",
      "phone",
      "wifi",
      "vcard",
    ]);
  });

  it("builds a URL payload and adds https:// when the scheme is missing", () => {
    expect(buildPayload("url", { ...defaultFormValues(), url: "example.com/page" })).toEqual({
      ok: true,
      data: "https://example.com/page",
    });
  });

  it("rejects empty and invalid URLs with a validation message", () => {
    const empty = buildPayload("url", defaultFormValues());
    expect(empty.ok).toBe(false);
    if (!empty.ok) expect(empty.error).toMatch(/enter a website URL/i);

    const invalid = buildPayload("url", { ...defaultFormValues(), url: "not a url" });
    expect(invalid.ok).toBe(false);
  });

  it("escapes Wi-Fi special characters and encodes security and hidden flags", () => {
    expect(
      buildPayload("wifi", {
        ...defaultFormValues(),
        wifi: {
          ssid: "My;Net",
          password: 'pa:ss,wo"rd',
          security: "WPA",
          hidden: true,
        },
      }),
    ).toEqual({
      ok: true,
      data: 'WIFI:T:WPA;S:My\\;Net;P:pa\\:ss\\,wo\\"rd;H:true;;',
    });
  });

  it("requires a password for secured Wi-Fi networks", () => {
    const result = buildPayload("wifi", {
      ...defaultFormValues(),
      wifi: { ssid: "Net", password: "", security: "WPA", hidden: false },
    });
    expect(result.ok).toBe(false);
  });

  it("builds a mailto payload with encoded subject and body", () => {
    expect(
      buildPayload("email", {
        ...defaultFormValues(),
        email: { address: "hi@example.com", subject: "Hello", message: "Big news" },
      }),
    ).toEqual({
      ok: true,
      data: "mailto:hi@example.com?subject=Hello&body=Big%20news",
    });
  });

  it("builds a tel: payload and strips formatting characters", () => {
    expect(buildPayload("phone", { ...defaultFormValues(), phone: "+91 98765-43210" })).toEqual({
      ok: true,
      data: "tel:+919876543210",
    });
  });

  it("builds a vCard with BEGIN/END, formatted name and fields", () => {
    const result = buildPayload("vcard", {
      ...defaultFormValues(),
      vcard: {
        name: "Ada Lovelace",
        phone: "+91 11111",
        email: "",
        organization: "Analytical Engines",
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.startsWith("BEGIN:VCARD")).toBe(true);
      expect(result.data.endsWith("END:VCARD")).toBe(true);
      expect(result.data).toContain("FN:Ada Lovelace");
      expect(result.data).toContain("TEL:+91 11111");
      expect(result.data).toContain("ORG:Analytical Engines");
    }
  });

  it("summarizes a URL payload by hostname", () => {
    expect(summarize("url", "https://www.example.com/path")).toBe("example.com");
  });
});
