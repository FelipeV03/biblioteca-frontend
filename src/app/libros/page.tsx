"use client";

import Link from "next/link";
import { useState } from "react";
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
import { useBooks, useDeleteBook } from "@/hooks/useBooks";
import { ApiError } from "@/lib/api/client";

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
    <main className="mx-auto flex max-w-5xl flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Libros</h1>
        <Button render={<Link href="/libros/nuevo" />}>Nuevo libro</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Buscar por título o autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Filtrar por género..."
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="max-w-xs"
        />
        <Select value={available} onValueChange={(value) => setAvailable(value ?? "all")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Disponibilidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Disponibles</SelectItem>
            <SelectItem value="false">Prestados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando libros...</p>}

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
