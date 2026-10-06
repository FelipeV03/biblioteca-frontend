"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { bookFormSchema, type BookFormValues } from "@/lib/schemas/book.schema";
import type { Book } from "@/types";

interface BookFormProps {
  defaultValues?: Partial<BookFormValues>;
  onSubmit: (values: BookFormValues) => Promise<void> | void;
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

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="flex flex-col gap-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Título</FieldLabel>
          <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="author">Autor</FieldLabel>
          <Input id="author" aria-invalid={!!errors.author} {...register("author")} />
          <FieldError errors={[errors.author]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="genre">Género</FieldLabel>
          <Input id="genre" aria-invalid={!!errors.genre} {...register("genre")} />
          <FieldError errors={[errors.genre]} />
        </Field>

        <Field orientation="responsive">
          <Field>
            <FieldLabel htmlFor="isbn">ISBN (opcional)</FieldLabel>
            <Input id="isbn" aria-invalid={!!errors.isbn} {...register("isbn")} />
            <FieldError errors={[errors.isbn]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="publishedYear">Año de publicación (opcional)</FieldLabel>
            <Input
              id="publishedYear"
              type="number"
              aria-invalid={!!errors.publishedYear}
              {...register("publishedYear")}
            />
            <FieldError errors={[errors.publishedYear]} />
          </Field>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
