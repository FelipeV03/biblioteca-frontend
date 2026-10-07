"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookTable } from "@/components/books/book-table";
import { PageHeader } from "@/components/layout/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { useBooks, useDeleteBook } from "@/hooks/useBooks";
import { useLoans } from "@/hooks/useLoans";
import { ApiError } from "@/lib/api/client";

const availabilityLabels: Record<string, string> = {
  all: "Todos los estados",
  true: "Disponibles",
  false: "Prestados",
};

const PAGE_SIZE = 10;
const FILTER_DEBOUNCE_MS = 350;

export default function LibrosPage() {
  const [searchInput, setSearchInput] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [available, setAvailable] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, FILTER_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGenre(genreInput);
      setPage(1);
    }, FILTER_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [genreInput]);

  const { data, isLoading, isError, error } = useBooks({
    search: search || undefined,
    genre: genre || undefined,
    available: available === "all" ? undefined : available === "true",
    page,
    limit: PAGE_SIZE,
  });

  const activeLoans = useLoans({ status: "active", limit: 100 });
  const dueDatesByBookId = Object.fromEntries(
    (activeLoans.data?.data ?? []).map((loan) => [loan.bookId, loan.dueDate]),
  );

  const deleteBook = useDeleteBook();

  async function handleDelete(id: number) {
    try {
      await deleteBook.mutateAsync(id);
      toast.success("Libro eliminado correctamente");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar el libro");
    }
  }

  function handleAvailabilityChange(value: string) {
    setAvailable(value);
    setPage(1);
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.meta.total / data.meta.limit)) : 1;
  const rangeStart = data && data.meta.total > 0 ? (page - 1) * data.meta.limit + 1 : 0;
  const rangeEnd = data ? Math.min(data.meta.total, page * data.meta.limit) : 0;

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-1 flex-col gap-6 p-6 sm:p-8">
      <PageHeader
        title="Libros"
        description="Consulta el catálogo, agrega, edita o elimina libros del acervo general."
        action={
          <Button render={<Link href="/libros/nuevo" />}>
            <Plus />
            Nuevo libro
          </Button>
        }
      />

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 border-b px-0.5 pb-1 sm:max-w-xs sm:flex-1 sm:border-b-0 sm:pb-0">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o autor..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Input
            placeholder="Filtrar por género..."
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            className="sm:min-w-44"
          />
          <Select value={available} onValueChange={(value) => handleAvailabilityChange(value ?? "all")}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Disponibilidad">
                {(value: string | null) => availabilityLabels[value ?? "all"] ?? "Disponibilidad"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="true">Disponibles</SelectItem>
              <SelectItem value="false">Prestados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data && (
          <div className="flex items-center gap-1.5 self-end text-xs text-muted-foreground lg:self-center">
            <Package className="size-3.5" />
            <span>
              Mostrando {rangeStart}–{rangeEnd} de {data.meta.total.toLocaleString("es-ES")} títulos registrados
            </span>
          </div>
        )}
      </div>

      {isLoading && <TableSkeleton columns={5} />}

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof ApiError ? error.message : "No se pudo conectar con el servidor"}
        </p>
      )}

      {data && (
        <>
          <BookTable
            books={data.data}
            dueDatesByBookId={dueDatesByBookId}
            onDelete={handleDelete}
            isDeleting={deleteBook.isPending}
          />

          <div className="flex items-center justify-end">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </main>
  );
}
