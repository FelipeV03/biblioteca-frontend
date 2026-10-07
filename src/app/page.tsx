"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, ClipboardCheck, Clock, RefreshCw, RotateCw, TriangleAlert, Undo2 } from "lucide-react";
import { getHealth } from "@/lib/api/health";
import { useBooks } from "@/hooks/useBooks";
import {
  useAverageLoanDuration,
  useAvailabilityByGenre,
  useLoansSummary,
  useTopBooks,
} from "@/hooks/useStats";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { QuickAccessCard } from "@/components/dashboard/quick-access-card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TopBooksPanel } from "@/components/dashboard/top-books-panel";
import { GenreAvailabilityPanel } from "@/components/dashboard/genre-availability-panel";

const today = new Date();
const formattedDate = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(today);
const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

function formatRelativeTime(timestamp: number) {
  const diffSeconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (diffSeconds < 10) return "justo ahora";
  if (diffSeconds < 60) return `hace ${diffSeconds} s`;
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `hace ${diffMinutes} min`;
  const diffHours = Math.round(diffMinutes / 60);
  return `hace ${diffHours} h`;
}

export default function Home() {
  const health = useQuery({ queryKey: ["health"], queryFn: getHealth });
  const totalBooks = useBooks({ limit: 1 });
  const loansSummary = useLoansSummary();
  const topBooks = useTopBooks(5);
  const availabilityByGenre = useAvailabilityByGenre();
  const averageDuration = useAverageLoanDuration();

  const dashboardQueries = [health, totalBooks, loansSummary, topBooks, availabilityByGenre, averageDuration];
  const isRefreshing = dashboardQueries.some((query) => query.isFetching);
  const lastUpdatedAt = Math.max(0, ...dashboardQueries.map((query) => query.dataUpdatedAt));

  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((value) => value + 1), 15_000);
    return () => clearInterval(interval);
  }, []);

  function handleRefresh() {
    dashboardQueries.forEach((query) => query.refetch());
  }

  const hasError =
    loansSummary.isError || topBooks.isError || availabilityByGenre.isError || averageDuration.isError;
  const firstError = [loansSummary.error, topBooks.error, availabilityByGenre.error, averageDuration.error].find(
    Boolean,
  );

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-1 flex-col gap-8 p-6 sm:p-8">
      <section className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Panel general</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Resumen del estado de la biblioteca</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 self-start rounded-lg border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex-nowrap sm:self-auto">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4 shrink-0" />
            {capitalizedDate}
          </span>
          <span className="hidden text-border sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <span className={cn("size-1.5 shrink-0 rounded-full", isRefreshing ? "bg-amber-500" : "bg-emerald-600")} />
            {lastUpdatedAt > 0 ? `Actualizado ${formatRelativeTime(lastUpdatedAt)}` : "Cargando datos..."}
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Recargar datos del panel"
            className="-mr-1 inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <RotateCw className={cn("size-3.5", isRefreshing && "animate-spin")} />
          </button>
        </div>
      </section>

      {hasError && (
        <p className="text-sm text-destructive">
          {firstError instanceof ApiError ? firstError.message : "No se pudo conectar con el servidor"}
        </p>
      )}

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <QuickAccessCard
          href="/libros"
          icon={BookOpen}
          title="Libros"
          description="Consulta el catálogo, agrega, edita o elimina libros."
          badge={`${(totalBooks.data?.meta.total ?? 0).toLocaleString("es-ES")} títulos`}
          footerLabel="Catálogo activo"
          footerCta="Ir al catálogo"
        />
        <QuickAccessCard
          href="/prestamos"
          icon={ClipboardCheck}
          title="Préstamos"
          description="Registra préstamos y marca devoluciones."
          badge={`${loansSummary.data?.data.active ?? 0} activos`}
          footerLabel="Mostrador de préstamos"
          footerCta="Gestionar préstamos"
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold tracking-tight">Resumen</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Préstamos activos"
            value={loansSummary.data?.data.active ?? "—"}
            icon={RefreshCw}
            caption="Préstamos en curso actualmente"
          />
          <MetricCard
            label="Préstamos vencidos"
            value={loansSummary.data?.data.overdue ?? "—"}
            icon={TriangleAlert}
            tone="destructive"
            caption="Requieren atención prioritaria"
          />
          <MetricCard
            label="Préstamos devueltos"
            value={loansSummary.data?.data.returned ?? "—"}
            icon={Undo2}
            caption="Registrados en total"
          />
          <MetricCard
            label="Duración promedio"
            value={
              averageDuration.data?.data.averageDays !== null && averageDuration.data?.data.averageDays !== undefined
                ? `${averageDuration.data.data.averageDays} días`
                : "—"
            }
            icon={Clock}
            caption="Tiempo medio por préstamo"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3 pb-2">
        <h2 className="text-sm font-semibold tracking-tight">Análisis</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TopBooksPanel books={topBooks.data?.data ?? []} />
          <GenreAvailabilityPanel data={availabilityByGenre.data?.data ?? []} />
        </div>
      </section>

      <footer className="-mx-6 mt-auto flex items-center border-t px-6 pt-4 text-xs text-muted-foreground sm:-mx-8 sm:px-8">
        {health.isLoading && (
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5">
            <span className="size-1.5 rounded-full bg-muted-foreground" />
            Comprobando backend...
          </span>
        )}
        {health.isError && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-destructive">
            <span className="size-1.5 rounded-full bg-destructive" />
            Sin conexión con el backend
          </span>
        )}
        {health.data && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-800">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            Backend operativo
          </span>
        )}
      </footer>
    </main>
  );
}
