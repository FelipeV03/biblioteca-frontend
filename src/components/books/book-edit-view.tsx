"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookForm, bookToFormValues } from "@/components/books/book-form";
import { useBook, useUpdateBook } from "@/hooks/useBooks";
import { ApiError } from "@/lib/api/client";
import type { BookFormValues } from "@/lib/schemas/book.schema";

export function BookEditView({ id }: { id: number }) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useBook(id);
  const updateBook = useUpdateBook(id);

  async function handleSubmit(values: BookFormValues) {
    try {
      await updateBook.mutateAsync({
        title: values.title,
        author: values.author,
        genre: values.genre,
        isbn: values.isbn ? values.isbn : null,
        publishedYear: values.publishedYear ? Number(values.publishedYear) : null,
      });
      toast.success("Libro actualizado correctamente");
      router.push("/libros");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo actualizar el libro");
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando libro...</p>;
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof ApiError ? error.message : "No se pudo cargar el libro"}
      </p>
    );
  }

  return (
    <BookForm
      defaultValues={bookToFormValues(data.data)}
      onSubmit={handleSubmit}
      isSubmitting={updateBook.isPending}
      submitLabel="Guardar cambios"
    />
  );
}
