"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { BookForm, bookToFormValues } from "@/components/books/book-form";
import { FormStatusBar } from "@/components/shared/form-status-bar";
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
      return true;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo actualizar el libro");
      return false;
    }
  }

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border bg-card">
        <FormStatusBar label="Cargando registro..." />
        <div className="flex flex-col gap-5 p-6 md:p-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof ApiError ? error.message : "No se pudo cargar el libro"}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <FormStatusBar label={`Editando «${data.data.title}»`} />
      <BookForm
        key={data.data.id}
        defaultValues={bookToFormValues(data.data)}
        onSubmit={handleSubmit}
        isSubmitting={updateBook.isPending}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
