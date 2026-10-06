"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/libros", label: "Libros" },
  { href: "/prestamos", label: "Préstamos" },
  { href: "/estadisticas", label: "Estadísticas" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 min-w-0 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <BookMarked className="size-5 text-primary" />
          Biblioteca
        </Link>
        <ul className="flex flex-wrap gap-x-1 gap-y-1 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  pathname === link.href && "bg-muted font-medium text-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
