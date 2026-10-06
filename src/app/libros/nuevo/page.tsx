"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { BookForm } from "@/components/books/book-form";
import { PageHeader } from "@/components/layout/page-header";
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
    <main className="mx-auto flex w-full min-w-0 max-w-lg flex-1 flex-col gap-6 p-6 sm:p-8">
      <PageHeader title="Nuevo libro" description="Completa los datos para agregarlo al catálogo." />
      <Card>
        <CardContent>
          <BookForm onSubmit={handleSubmit} isSubmitting={createBook.isPending} submitLabel="Crear libro" />
        </CardContent>
      </Card>
    </main>
  );
}
