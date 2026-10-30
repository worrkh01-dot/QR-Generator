import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/generate", label: "Generate QR", exact: false },
  { to: "/my-qr-codes", label: "My QR Codes", exact: false },
  { to: "/about", label: "About", exact: false },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={close}>
          <span className="flex size-9 items-center justify-center rounded-xl text-primary-foreground shadow-glow [background-image:var(--gradient-brand)]">
            <QrCode className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">QRify</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact }}
              className="nav-link rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link to="/generate">Generate QR Code</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open ? (
        <nav
          className="flex flex-col gap-1 border-t bg-background px-4 pb-4 pt-2 md:hidden"
          aria-label="Mobile"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact }}
              className="nav-link rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              onClick={close}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild className="mt-2">
            <Link to="/generate" onClick={close}>
              Generate QR Code
            </Link>
          </Button>
        </nav>
      ) : null}
    </header>
  );
}
