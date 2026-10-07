"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { BookForm } from "@/components/books/book-form";
import { FormStatusBar } from "@/components/shared/form-status-bar";
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
      return true;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo crear el libro");
      return false;
    }
  }

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <Link
        href="/libros"
        className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Volver al catálogo
      </Link>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Nuevo libro</h1>
        <p className="mt-1 text-sm text-muted-foreground">Completa los datos para agregarlo al catálogo.</p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <FormStatusBar label="Nuevo registro en el catálogo" />
        <BookForm onSubmit={handleSubmit} isSubmitting={createBook.isPending} submitLabel="Crear libro" />
      </div>
    </main>
  );
}
