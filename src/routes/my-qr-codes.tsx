import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Copy, Download, Eye, History, QrCode, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCanvas } from "@/components/qr/qr-canvas";
import { QR_TYPE_ICONS } from "@/components/qr/qr-type-picker";
import { QR_TYPES } from "@/lib/qr-data";
import {
  copyText,
  downloadQrPng,
  downloadQrSvg,
  safeFilename,
} from "@/lib/qr";
import {
  clearAllHistory,
  loadHistory,
  removeHistoryEntry,
  type QRHistoryEntry,
} from "@/lib/qr-history";

export const Route = createFileRoute("/my-qr-codes")({
  head: () => ({
    meta: [
      { title: "My QR Codes – QRify" },
      {
        name: "description",
        content:
          "Your saved QR codes — preview, download again or delete them. Stored privately in your browser.",
      },
      { property: "og:title", content: "My QR Codes – QRify" },
      {
        property: "og:description",
        content:
          "Your saved QR codes — preview, download again or delete them. Stored privately in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "My QR Codes – QRify" },
      {
        name: "twitter:description",
        content:
          "Your saved QR codes — preview, download again or delete them. Stored privately in your browser.",
      },
    ],
  }),
  component: MyQrCodesPage,
});

function typeLabel(id: QRHistoryEntry["type"]) {
  return QR_TYPES.find((t) => t.id === id)?.label ?? id;
}

function MyQrCodesPage() {
  const [entries, setEntries] = useState<QRHistoryEntry[]>([]);
  const [preview, setPreview] = useState<QRHistoryEntry | null>(null);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const handleDelete = (id: string) => {
    setEntries(removeHistoryEntry(id));
    toast("QR code deleted.");
  };

  const handleClearAll = () => {
    setEntries(clearAllHistory());
    toast("History cleared.");
  };

  const handleCopy = async (entry: QRHistoryEntry) => {
    const copied = await copyText(entry.data);
    if (copied) toast.success("Content copied to clipboard.");
    else toast.error("Couldn't copy — please copy it manually.");
  };

  const handleDownload = async (entry: QRHistoryEntry, fmt: "png" | "svg") => {
    const filename = safeFilename(entry.title || "qrify");
    try {
      if (fmt === "png") {
        await downloadQrPng(entry.data, entry.style, filename);
        toast.success("PNG downloaded.");
      } else {
        await downloadQrSvg(entry.data, entry.style, filename);
        toast.success("SVG downloaded.");
      }
    } catch {
      toast.error("Couldn't download the file. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            My <span className="gradient-text">QR Codes</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Everything you've generated, saved privately in this browser.
          </p>
        </div>
        {entries.length > 0 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Trash2 />
                Clear all
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all saved QR codes?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes all {entries.length} saved QR codes from this
                  browser. This can't be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>
                  Delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>

      {entries.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-dashed bg-card/60 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
            <History className="size-6" />
          </span>
          <div>
            <h2 className="font-semibold text-foreground">No QR codes yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate your first QR code and it will show up here automatically.
            </p>
          </div>
          <Button variant="hero" asChild>
            <Link to="/generate">
              <QrCode />
              Generate QR Code
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const Icon = QR_TYPE_ICONS[entry.type];
            return (
              <div
                key={entry.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-soft"
              >
                <button
                  type="button"
                  className="cursor-zoom-in overflow-hidden rounded-xl border border-border"
                  style={{ background: entry.style.light }}
                  onClick={() => setPreview(entry)}
                  aria-label={`Preview ${entry.title}`}
                >
                  <QRCanvas
                    text={entry.data}
                    style={{ ...entry.style, size: 256 }}
                    className="aspect-square h-auto w-full"
                  />
                </button>
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                    {typeLabel(entry.type)}
                  </span>
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-foreground">
                  {entry.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(entry.createdAt), "MMM d, yyyy · HH:mm")}
                </p>
                <div className="mt-3 flex items-center gap-1.5 border-t border-border/70 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(entry, "png")}
                  >
                    <Download />
                    PNG
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreview(entry)}
                  >
                    <Eye />
                    Preview
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${entry.title}`}
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview dialog */}
      <Dialog
        open={!!preview}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
      >
        <DialogContent className="max-w-sm">
          {preview ? (
            <>
              <DialogHeader>
                <DialogTitle>{preview.title}</DialogTitle>
                <DialogDescription>
                  {typeLabel(preview.type)} ·{" "}
                  {format(new Date(preview.createdAt), "MMM d, yyyy · HH:mm")}
                </DialogDescription>
              </DialogHeader>
              <div
                className="overflow-hidden rounded-xl border border-border"
                style={{ background: preview.style.light }}
              >
                <QRCanvas
                  text={preview.data}
                  style={{ ...preview.style, size: 384 }}
                  className="aspect-square h-auto w-full"
                />
              </div>
              <p className="max-h-24 overflow-y-auto break-all rounded-lg bg-muted p-2.5 font-mono text-xs text-muted-foreground">
                {preview.data}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button size="sm" onClick={() => handleDownload(preview, "png")}>
                  <Download />
                  PNG
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(preview, "svg")}
                >
                  <Download />
                  SVG
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(preview)}
                >
                  <Copy />
                  Copy
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
