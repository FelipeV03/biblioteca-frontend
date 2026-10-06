"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookForm } from "@/components/books/book-form";
import { useCreateBook } from "@/hooks/useBooks";
import { ApiError } from "@/lib/api/client";
import type { BookFormValues } from "@/lib/schemas/book.schema";

export default function NuevoLibroPage() {
  const router = useRouter();
  const createBook = useCreateBook();

  async function handleSubmit(values: BookFormValues) {
    try {
      await createBook.mutateAsync({
        title: values.title,
        author: values.author,
        genre: values.genre,
        isbn: values.isbn || undefined,
        publishedYear: values.publishedYear ? Number(values.publishedYear) : undefined,
      });
      toast.success("Libro creado correctamente");
      router.push("/libros");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo crear el libro");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Nuevo libro</h1>
      <BookForm onSubmit={handleSubmit} isSubmitting={createBook.isPending} submitLabel="Crear libro" />
    </main>
  );
}
