import type { GenreAvailability } from "@/types";

export function GenreAvailabilityPanel({ data }: { data: GenreAvailability[] }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border bg-card p-5">
      <div>
        <div className="flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Disponibilidad por género</h3>
            <p className="text-xs text-muted-foreground">Disponibles vs. prestados por categoría</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-muted-foreground/40" />
              <span className="text-muted-foreground">Disponibles</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-primary" />
              <span className="font-medium text-foreground">Prestados</span>
            </span>
          </div>
        </div>

        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aún no hay libros registrados.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {data.map((genre) => {
              const total = Math.max(1, genre.total);
              const availablePct = (genre.available / total) * 100;
              const borrowedPct = (genre.borrowed / total) * 100;

              return (
                <div key={genre.genre}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{genre.genre}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {genre.available} disp. / <span className="font-semibold text-primary">{genre.borrowed} prest.</span>
                    </span>
                  </div>
                  <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-muted-foreground/40" style={{ width: `${availablePct}%` }} />
                    <div className="h-full bg-primary" style={{ width: `${borrowedPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
