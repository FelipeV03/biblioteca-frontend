import type { TopBook } from "@/types";

export function TopBooksPanel({ books }: { books: TopBook[] }) {
  const maxLoans = Math.max(1, ...books.map((book) => book.loanCount));

  return (
    <div className="flex flex-col justify-between rounded-xl border bg-card p-5">
      <div>
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Libros más prestados</h3>
            <p className="text-xs text-muted-foreground">Top {books.length || 5} títulos con mayor demanda</p>
          </div>
          <span className="rounded border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
            Acumulado
          </span>
        </div>

        {books.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aún no hay préstamos registrados.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {books.map((book) => (
              <div key={book.bookId}>
                <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                  <div className="truncate">
                    <span className="font-medium text-foreground">{book.title}</span>
                    <span className="text-xs text-muted-foreground"> — {book.author}</span>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-semibold text-foreground">
                    {book.loanCount} <span className="font-normal text-muted-foreground">préstamos</span>
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(4, (book.loanCount / maxLoans) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
