"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { bookFormSchema, type BookFormValues } from "@/lib/schemas/book.schema";
import type { Book } from "@/types";

interface BookFormProps {
  defaultValues?: Partial<BookFormValues>;
  onSubmit: (values: BookFormValues) => Promise<boolean | void> | boolean | void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function bookToFormValues(book: Book): BookFormValues {
  return {
    title: book.title,
    author: book.author,
    genre: book.genre,
    isbn: book.isbn ?? "",
    publishedYear: book.publishedYear ? String(book.publishedYear) : "",
  };
}

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  );
}

export function BookForm({ defaultValues, onSubmit, isSubmitting, submitLabel = "Guardar" }: BookFormProps) {
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      isbn: "",
      publishedYear: "",
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  async function handleFormSubmit(values: BookFormValues) {
    const succeeded = await onSubmit(values);
    if (succeeded === true) {
      form.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 p-6 md:p-8">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">
            Título del libro <RequiredMark />
          </FieldLabel>
          <Input
            id="title"
            placeholder="Ej. Cien años de soledad"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="author">
            Autor / Autores <RequiredMark />
          </FieldLabel>
          <Input
            id="author"
            placeholder="Ej. Gabriel García Márquez"
            aria-invalid={!!errors.author}
            {...register("author")}
          />
          <FieldDescription>Separa varios autores con comas si corresponde.</FieldDescription>
          <FieldError errors={[errors.author]} />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="genre">
              Género o categoría <RequiredMark />
            </FieldLabel>
            <Input
              id="genre"
              placeholder="Ej. Narrativa / Ficción"
              aria-invalid={!!errors.genre}
              {...register("genre")}
            />
            <FieldError errors={[errors.genre]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="publishedYear">Año de publicación</FieldLabel>
            <Input
              id="publishedYear"
              type="number"
              placeholder="Ej. 1967"
              aria-invalid={!!errors.publishedYear}
              {...register("publishedYear")}
            />
            <FieldError errors={[errors.publishedYear]} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="isbn">ISBN o código de registro</FieldLabel>
          <Input
            id="isbn"
            placeholder="Ej. 978-84-376-0494-7"
            className="font-mono"
            aria-invalid={!!errors.isbn}
            {...register("isbn")}
          />
          <FieldDescription>Código normalizado de 10 o 13 dígitos (opcional).</FieldDescription>
          <FieldError errors={[errors.isbn]} />
        </Field>
      </FieldGroup>

      <div className="flex items-center justify-between border-t pt-6">
        <p className="hidden font-mono text-xs text-muted-foreground sm:block">* Campos obligatorios</p>
        <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
          <Button type="button" variant="outline" onClick={() => form.reset()} render={<Link href="/libros" />}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save />
            {isSubmitting ? "Guardando..." : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
