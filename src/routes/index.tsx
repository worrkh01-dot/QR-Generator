import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  MousePointerClick,
  Palette,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCanvas } from "@/components/qr/qr-canvas";
import { QR_TYPE_ICONS } from "@/components/qr/qr-type-picker";
import { QR_TYPES } from "@/lib/qr-data";
import { DEFAULT_QR_STYLE } from "@/lib/qr";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QRify – Smart QR Code Generator" },
      {
        name: "description",
        content:
          "Turn anything into a QR code. Generate, customize and download QR codes in seconds — simple, fast and free.",
      },
      { property: "og:title", content: "QRify – Smart QR Code Generator" },
      {
        property: "og:description",
        content:
          "Generate, customize and download QR codes in seconds. Simple, fast and free.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "QRify – Smart QR Code Generator" },
      {
        name: "twitter:description",
        content:
          "Generate, customize and download QR codes in seconds. Simple, fast and free.",
      },
    ],
  }),
  component: Index,
});

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Pick a type",
    text: "Website, text, email, phone, Wi-Fi or a contact card — choose what you want to share.",
  },
  {
    step: "2",
    title: "Customize it",
    text: "Choose colors, size, error correction and even drop your own logo in the middle.",
  },
  {
    step: "3",
    title: "Download & share",
    text: "Export a crisp PNG or a scalable SVG, print it, or save it to your QR library.",
  },
];

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-mesh relative overflow-hidden">
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-0 opacity-60"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-soft">
              <Sparkles className="size-3.5" />
              Free · No signup · Privacy friendly
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
              Turn Anything Into a{" "}
              <span className="gradient-text">QR Code</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              Generate, customize and download QR codes in seconds. Simple, fast
              and free.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/generate">
                  Generate QR Code
                  <ArrowRight />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/about">Explore Features</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {["6 QR types", "PNG & SVG downloads", "Live preview", "Works offline"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-primary" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Visual preview */}
          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-primary-glow/20 blur-2xl"
            />
            <div className="relative rounded-3xl border border-border bg-card p-5 shadow-card">
              <div className="mb-4 flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-destructive/70" />
                <span className="size-2.5 rounded-full bg-chart-4" />
                <span className="size-2.5 rounded-full bg-chart-3" />
                <span className="ml-3 flex-1 rounded-md bg-secondary px-3 py-1 text-center text-xs text-muted-foreground">
                  qrify.app/generate
                </span>
              </div>
              <ClientOnly
                fallback={
                  <div className="aspect-square w-full animate-pulse rounded-2xl bg-secondary" />
                }
              >
                <QRCanvas
                  text="https://qrify.app/generate"
                  style={DEFAULT_QR_STYLE}
                  className="aspect-square h-auto w-full rounded-xl"
                />
              </ClientOnly>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Scan me — this is a real, live QR code
              </p>
            </div>
            <div className="absolute -left-6 top-10 hidden rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-card sm:block">
              Wi-Fi ready
            </div>
            <div className="absolute -right-5 bottom-24 hidden rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-card sm:block">
              vCard sharing
            </div>
          </div>
        </div>
      </section>

      {/* QR types */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Six kinds of QR codes, one simple flow
          </h2>
          <p className="mt-2 text-muted-foreground">
            Whatever you want to share, there's a type for it.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QR_TYPES.map((t) => {
            const Icon = QR_TYPE_ICONS[t.id];
            return (
              <Link
                key={t.id}
                to="/generate"
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">{t.label}</span>
                  <span className="block text-sm text-muted-foreground">
                    {t.description}
                  </span>
                </span>
                <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/70 bg-card/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            From idea to scannable code in three steps
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="relative rounded-2xl bg-card p-6 shadow-card">
                <span className="flex size-9 items-center justify-center rounded-xl text-sm font-bold text-primary-foreground [background-image:var(--gradient-brand)]">
                  {s.step}
                </span>
                <h3 className="mt-4 font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl p-8 text-primary-foreground shadow-glow [background-image:var(--gradient-brand)] sm:p-12 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to make your first QR code?
            </h2>
            <p className="mt-2 max-w-md text-primary-foreground/80">
              No account, no limits, no watermarks. Your codes stay on your device.
            </p>
          </div>
          <Button variant="secondary" size="xl" asChild className="shrink-0">
            <Link to="/generate">
              <Zap />
              Start generating
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

// Re-exported so tree-shaking keeps the feature-card icon imports tidy.
export { Download, MousePointerClick, Palette, ShieldCheck };
