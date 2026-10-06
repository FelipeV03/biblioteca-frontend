"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, BookOpen, ClipboardList, type LucideIcon } from "lucide-react";
import { getHealth } from "@/lib/api/health";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NavCard {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const navCards: NavCard[] = [
  {
    href: "/libros",
    title: "Libros",
    description: "Consulta el catálogo, agrega, edita o elimina libros.",
    icon: BookOpen,
  },
  {
    href: "/prestamos",
    title: "Préstamos",
    description: "Registra préstamos y marca devoluciones.",
    icon: ClipboardList,
  },
  {
    href: "/estadisticas",
    title: "Estadísticas",
    description: "Revisa el estado general de la biblioteca.",
    icon: BarChart3,
  },
];

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  });

  return (
    <main className="mx-auto flex min-w-0 max-w-5xl flex-1 flex-col gap-8 p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Sistema de Biblioteca</h1>
        <p className="text-muted-foreground">Gestiona libros, préstamos y consulta estadísticas en un solo lugar.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {navCards.map((card) => (
          <Link key={card.href} href={card.href} className="rounded-xl focus-visible:outline-2 focus-visible:outline-ring">
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <card.icon className="size-5" />
                </div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Estado del backend:
        {isLoading && <Badge variant="secondary">Comprobando...</Badge>}
        {isError && (
          <Badge variant="destructive">
            Sin conexión: {error instanceof Error ? error.message : "error desconocido"}
          </Badge>
        )}
        {data && <Badge>{data.data.status}</Badge>}
      </div>
    </main>
  );
}
