import { Link } from "@tanstack/react-router";
import { QrCode } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg text-primary-foreground [background-image:var(--gradient-brand)]">
            <QrCode className="size-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">QRify</p>
            <p className="text-xs text-muted-foreground">
              Smart QR code generator — free, fast and private.
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <Link to="/generate" className="hover:text-foreground">
            Generate QR
          </Link>
          <Link to="/my-qr-codes" className="hover:text-foreground">
            My QR Codes
          </Link>
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} QRify. Made with care.
        </p>
      </div>
    </footer>
  );
}
