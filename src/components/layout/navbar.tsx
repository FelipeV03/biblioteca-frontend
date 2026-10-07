"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/libros", label: "Libros" },
  { href: "/prestamos", label: "Préstamos" },
];

function NavLink({
  href,
  label,
  isActive,
  mobile,
  onNavigate,
}: {
  href: string;
  label: string;
  isActive: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        mobile
          ? "rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          : "-mb-px border-b-2 border-transparent py-4 font-medium text-muted-foreground transition-colors hover:text-foreground",
        isActive && (mobile ? "bg-primary/10 text-primary" : "border-primary text-primary"),
      )}
    >
      {label}
    </Link>
  );
}

// usePathname() reads runtime routing info; it's isolated here and wrapped in
// Suspense so Next (cacheComponents) can prerender a static shell and stream
// in the active-link highlight once the real pathname is known.
function NavLinks({ mobile, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return links.map((link) => (
    <NavLink
      key={link.href}
      href={link.href}
      label={link.label}
      isActive={pathname === link.href}
      mobile={mobile}
      onNavigate={onNavigate}
    />
  ));
}

function NavLinksFallback({ mobile }: { mobile?: boolean }) {
  return links.map((link) => (
    <NavLink key={link.href} href={link.href} label={link.label} isActive={false} mobile={mobile} />
  ));
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 min-w-0 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-[1600px] min-w-0 items-center justify-between gap-3 px-3 sm:justify-start sm:gap-6 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 font-semibold tracking-tight sm:gap-2">
          <Library className="size-5 text-primary" />
          Biblioteca
        </Link>

        <nav className="hidden items-center gap-3 text-sm sm:flex sm:gap-5">
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30 cursor-default bg-black/10 sm:hidden"
          />
          <nav className="relative z-40 flex flex-col gap-0.5 border-t bg-background p-2 sm:hidden">
            <Suspense fallback={<NavLinksFallback mobile />}>
              <NavLinks mobile onNavigate={() => setMenuOpen(false)} />
            </Suspense>
          </nav>
        </>
      )}
    </header>
  );
}
