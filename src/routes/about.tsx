import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Download,
  Heart,
  LayoutGrid,
  MousePointerClick,
  Palette,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About – QRify" },
      {
        name: "description",
        content:
          "QRify is a free, privacy-friendly QR code generator — instant codes, custom designs and high-quality PNG & SVG downloads.",
      },
      { property: "og:title", content: "About – QRify" },
      {
        property: "og:description",
        content:
          "QRify is a free, privacy-friendly QR code generator — instant codes, custom designs and high-quality downloads.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About – QRify" },
      {
        name: "twitter:description",
        content:
          "QRify is a free, privacy-friendly QR code generator — instant codes, custom designs and high-quality downloads.",
      },
    ],
  }),
  component: AboutPage,
});

const FEATURES = [
  {
    icon: Zap,
    title: "Instant QR Generation",
    text: "Every code is generated in your browser the moment you type — no waiting, no uploads.",
  },
  {
    icon: Palette,
    title: "Customizable Designs",
    text: "Pick colors, sizes and error-correction levels, or drop your own logo in the middle.",
  },
  {
    icon: Download,
    title: "High-Quality Downloads",
    text: "Export crisp PNG files or infinitely scalable SVGs, ready for print and screens.",
  },
  {
    icon: LayoutGrid,
    title: "Multiple QR Types",
    text: "URLs, plain text, email drafts, phone numbers, Wi-Fi networks and contact cards.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy Friendly",
    text: "Everything runs locally in your browser. No accounts, no tracking, no servers.",
  },
  {
    icon: MousePointerClick,
    title: "Easy to Use",
    text: "Pick a type, fill in the blanks, download. That's the whole flow — nothing to learn.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3.5 py-1.5 text-xs font-semibold text-primary shadow-soft">
          <Heart className="size-3.5" />
          Built to be simple
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          About <span className="gradient-text">QRify</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          QRify is a smart QR code generator for everyone. Whether you want to
          share a website, your Wi-Fi password or a contact card, QRify turns it
          into a beautiful, scannable QR code in seconds — right in your
          browser. Nothing is uploaded, nothing is tracked, and every download
          is yours to keep.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
          >
            <span className="flex size-11 items-center justify-center rounded-xl text-primary-foreground [background-image:var(--gradient-brand)]">
              <f.icon className="size-5" />
            </span>
            <h2 className="mt-4 font-semibold text-foreground">{f.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 text-primary-foreground shadow-glow [background-image:var(--gradient-brand)] sm:p-10 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Try it now — it takes less than a minute.
          </h2>
          <p className="mt-1.5 text-primary-foreground/80">
            No account, no limits, no watermarks.
          </p>
        </div>
        <Button variant="secondary" size="xl" asChild className="shrink-0">
          <Link to="/generate">
            Generate QR Code
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
