"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
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
import { useBooks, useDeleteBook } from "@/hooks/useBooks";
import { ApiError } from "@/lib/api/client";

const availabilityLabels: Record<string, string> = {
  all: "Todos",
  true: "Disponibles",
  false: "Prestados",
};

export default function LibrosPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [available, setAvailable] = useState<string>("all");

  const { data, isLoading, isError, error } = useBooks({
    search: search || undefined,
    genre: genre || undefined,
    available: available === "all" ? undefined : available === "true",
    limit: 50,
  });

  const deleteBook = useDeleteBook();

  async function handleDelete(id: number) {
    try {
      await deleteBook.mutateAsync(id);
      toast.success("Libro eliminado correctamente");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar el libro");
    }
  }

  return (
    <main className="mx-auto flex min-w-0 max-w-5xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <PageHeader
        title="Libros"
        description="Catálogo de libros de la biblioteca."
        action={
          <Button render={<Link href="/libros/nuevo" />}>
            <Plus />
            Nuevo libro
          </Button>
        }
      />

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:min-w-48 sm:flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título o autor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Input
          placeholder="Filtrar por género..."
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full sm:min-w-40 sm:max-w-xs sm:flex-1"
        />
        <Select value={available} onValueChange={(value) => setAvailable(value ?? "all")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Disponibilidad">
              {(value: string | null) => availabilityLabels[value ?? "all"] ?? "Disponibilidad"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Disponibles</SelectItem>
            <SelectItem value="false">Prestados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <TableSkeleton columns={5} />}

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof ApiError ? error.message : "No se pudo conectar con el servidor"}
        </p>
      )}

      {data && (
        <BookTable books={data.data} onDelete={handleDelete} isDeleting={deleteBook.isPending} />
      )}
    </main>
  );
}
