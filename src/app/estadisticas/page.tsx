"use client";

import { BookCheck, CalendarClock, CircleCheckBig, TriangleAlert } from "lucide-react";
import { StatCard } from "@/components/stats/stat-card";
import { TopBooksChart } from "@/components/stats/top-books-chart";
import { GenreAvailabilityChart } from "@/components/stats/genre-availability-chart";
import { PageHeader } from "@/components/layout/page-header";
import { ApiError } from "@/lib/api/client";
import {
  useAverageLoanDuration,
  useAvailabilityByGenre,
  useLoansSummary,
  useTopBooks,
} from "@/hooks/useStats";

export default function EstadisticasPage() {
  const loansSummary = useLoansSummary();
  const topBooks = useTopBooks(5);
  const availabilityByGenre = useAvailabilityByGenre();
  const averageDuration = useAverageLoanDuration();

  const hasError =
    loansSummary.isError || topBooks.isError || availabilityByGenre.isError || averageDuration.isError;
  const firstError = [loansSummary.error, topBooks.error, availabilityByGenre.error, averageDuration.error].find(
    Boolean,
  );

  return (
    <main className="mx-auto flex min-w-0 max-w-5xl flex-1 flex-col gap-8 p-6 sm:p-8">
      <PageHeader title="Estadísticas" description="Una vista general del estado de la biblioteca." />

      {hasError && (
        <p className="text-sm text-destructive">
          {firstError instanceof ApiError ? firstError.message : "No se pudo conectar con el servidor"}
        </p>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Resumen</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Préstamos activos" value={loansSummary.data?.data.active ?? "—"} icon={BookCheck} />
          <StatCard
            label="Préstamos vencidos"
            value={loansSummary.data?.data.overdue ?? "—"}
            icon={TriangleAlert}
            tone="destructive"
          />
          <StatCard
            label="Préstamos devueltos"
            value={loansSummary.data?.data.returned ?? "—"}
            icon={CircleCheckBig}
            tone="muted"
          />
          <StatCard
            label="Duración promedio"
            value={
              averageDuration.data?.data.averageDays !== null && averageDuration.data?.data.averageDays !== undefined
                ? `${averageDuration.data.data.averageDays} días`
                : "—"
            }
            icon={CalendarClock}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Análisis</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <TopBooksChart books={topBooks.data?.data ?? []} />
          <GenreAvailabilityChart data={availabilityByGenre.data?.data ?? []} />
        </div>
      </section>
    </main>
  );
}
