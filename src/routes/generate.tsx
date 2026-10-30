import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Copy,
  Download,
  FileCode2,
  Image,
  QrCode,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QRTypePicker } from "@/components/qr/qr-type-picker";
import { QRFields } from "@/components/qr/qr-fields";
import { QRCustomizer } from "@/components/qr/qr-customizer";
import { QRCanvas } from "@/components/qr/qr-canvas";
import {
  buildPayload,
  defaultFormValues,
  QR_TYPES,
  summarize,
  type QRFormValues,
  type QRTypeId,
} from "@/lib/qr-data";
import {
  copyText,
  DEFAULT_QR_STYLE,
  downloadQrPng,
  downloadQrSvg,
  safeFilename,
  type QRStyle,
} from "@/lib/qr";
import { addHistoryEntry } from "@/lib/qr-history";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "QR Code Generator – QRify" },
      {
        name: "description",
        content:
          "Create QR codes for websites, text, email, phone, Wi-Fi and contacts. Customize colors, size and error correction, then download PNG or SVG.",
      },
      { property: "og:title", content: "QR Code Generator – QRify" },
      {
        property: "og:description",
        content:
          "Create QR codes for websites, text, email, phone, Wi-Fi and contacts — then download as PNG or SVG.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "QR Code Generator – QRify" },
      {
        name: "twitter:description",
        content:
          "Create QR codes for websites, text, email, phone, Wi-Fi and contacts — then download as PNG or SVG.",
      },
    ],
  }),
  component: GeneratePage,
});

function StepBadge({ n }: { n: string }) {
  return (
    <span className="flex size-6 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground [background-image:var(--gradient-brand)]">
      {n}
    </span>
  );
}

function GeneratePage() {
  const [type, setType] = useState<QRTypeId>("url");
  const [form, setForm] = useState<QRFormValues>(defaultFormValues);
  const [style, setStyle] = useState<QRStyle>(DEFAULT_QR_STYLE);
  const [generated, setGenerated] = useState<string | null>(null);

  const result = useMemo(() => buildPayload(type, form), [type, form]);
  const payload = result.ok ? result.data : null;
  const typeLabel = QR_TYPES.find((t) => t.id === type)?.label ?? "QR code";

  const handleGenerate = () => {
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setGenerated(result.data);
    addHistoryEntry({
      id: crypto.randomUUID(),
      type,
      title: summarize(type, result.data),
      data: result.data,
      style: { ...style },
      createdAt: Date.now(),
    });
    toast.success("QR code generated and saved to My QR Codes.");
  };

  const handleReset = () => {
    setType("url");
    setForm(defaultFormValues());
    setStyle(DEFAULT_QR_STYLE);
    setGenerated(null);
    toast("Everything reset.");
  };

  const handleCopy = async () => {
    const value = generated ?? payload;
    if (!value) return;
    const copied = await copyText(value);
    if (copied) toast.success("Content copied to clipboard.");
    else toast.error("Couldn't copy — please copy it manually.");
  };

  const filename = safeFilename(generated ? summarize(type, generated) : "qrify");

  const handleDownloadPng = async () => {
    if (!generated) return;
    try {
      await downloadQrPng(generated, style, filename);
      toast.success("PNG downloaded.");
    } catch {
      toast.error("Couldn't download the PNG. Please try again.");
    }
  };

  const handleDownloadSvg = async () => {
    if (!generated) return;
    try {
      await downloadQrSvg(generated, style, filename);
      toast.success("SVG downloaded.");
    } catch {
      toast.error("Couldn't download the SVG. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          QR Code <span className="gradient-text">Generator</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pick a type, fill in the details, style it your way — the preview
          updates as you type.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Left: builder */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <StepBadge n="1" />
              <div>
                <CardTitle>Choose QR type</CardTitle>
                <CardDescription>What should the code contain?</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <QRTypePicker value={type} onChange={setType} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <StepBadge n="2" />
              <div>
                <CardTitle>Enter details</CardTitle>
                <CardDescription>
                  {typeLabel} — only these fields go into the code.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <QRFields type={type} values={form} onChange={setForm} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <StepBadge n="3" />
              <div>
                <CardTitle>Customize</CardTitle>
                <CardDescription>
                  Colors, size, error correction and an optional center logo.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <QRCustomizer style={style} onChange={setStyle} />
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="xl" className="flex-1" onClick={handleGenerate}>
              <Sparkles />
              Generate QR Code
            </Button>
            <Button variant="outline" size="xl" onClick={handleReset}>
              <RotateCcw />
              Reset
            </Button>
          </div>
        </div>

        {/* Right: live preview + actions */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Live preview
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  updates as you type
                </span>
              </CardTitle>
              <CardDescription>
                This is exactly what will be downloaded.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {payload ? (
                <div
                  className="overflow-hidden rounded-xl border border-border"
                  style={{ background: style.light }}
                >
                  <QRCanvas
                    text={payload}
                    style={style}
                    className="aspect-square h-auto w-full"
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-secondary/50 p-6 text-center">
                  <QrCode className="size-10 text-primary/50" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {result.ok ? "Your QR code will appear here." : result.error}
                  </p>
                </div>
              )}

              {payload ? (
                <p className="break-all rounded-lg bg-muted p-2.5 font-mono text-xs text-muted-foreground">
                  {payload}
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Download & share</CardTitle>
              <CardDescription>
                {generated
                  ? "Saved to My QR Codes — download or copy the content."
                  : "Press “Generate QR Code” to unlock downloads."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button onClick={handleDownloadPng} disabled={!generated}>
                <Image />
                Download PNG
              </Button>
              <Button variant="outline" onClick={handleDownloadSvg} disabled={!generated}>
                <FileCode2 />
                Download SVG
              </Button>
              <Button variant="outline" onClick={handleCopy} disabled={!payload}>
                <Copy />
                Copy Content
              </Button>
              {generated ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  Saved as “{filename}” ·{" "}
                  <Link to="/my-qr-codes" className="font-medium text-primary underline-offset-2 hover:underline">
                    open My QR Codes
                  </Link>
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
