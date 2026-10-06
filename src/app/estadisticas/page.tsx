"use client";

import { StatCard } from "@/components/stats/stat-card";
import { TopBooksChart } from "@/components/stats/top-books-chart";
import { GenreAvailabilityChart } from "@/components/stats/genre-availability-chart";
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

  return (
    <main className="mx-auto flex max-w-5xl flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Estadísticas</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Préstamos activos" value={loansSummary.data?.data.active ?? "—"} />
        <StatCard label="Préstamos vencidos" value={loansSummary.data?.data.overdue ?? "—"} tone="destructive" />
        <StatCard label="Préstamos devueltos" value={loansSummary.data?.data.returned ?? "—"} tone="muted" />
        <StatCard
          label="Duración promedio"
          value={
            averageDuration.data?.data.averageDays !== null && averageDuration.data?.data.averageDays !== undefined
              ? `${averageDuration.data.data.averageDays} días`
              : "—"
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TopBooksChart books={topBooks.data?.data ?? []} />
        <GenreAvailabilityChart data={availabilityByGenre.data?.data ?? []} />
      </div>
    </main>
  );
}
