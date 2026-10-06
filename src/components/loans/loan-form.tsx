"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBooks } from "@/hooks/useBooks";
import { useUsers } from "@/hooks/useUsers";
import { loanFormSchema, type LoanFormInput, type LoanFormValues } from "@/lib/schemas/loan.schema";
import { UserQuickCreateDialog } from "./user-quick-create-dialog";

interface LoanFormProps {
  onSubmit: (values: LoanFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function LoanForm({ onSubmit, isSubmitting }: LoanFormProps) {
  const { data: booksData } = useBooks({ available: true, limit: 100 });
  const { data: usersData, refetch: refetchUsers } = useUsers();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoanFormInput>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: { bookId: "", userId: "" },
  });

  const books = booksData?.data ?? [];
  const users = usersData?.data ?? [];

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({ bookId: Number(values.bookId), userId: Number(values.userId) }),
      )}
      className="flex flex-col gap-5"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="bookId">Libro</FieldLabel>
          <Controller
            control={control}
            name="bookId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "")}>
                <SelectTrigger id="bookId" aria-invalid={!!errors.bookId}>
                  <SelectValue placeholder={books.length === 0 ? "No hay libros disponibles" : "Selecciona un libro"}>
                    {(value: string | null) => {
                      const book = books.find((b) => String(b.id) === value);
                      return book ? `${book.title} — ${book.author}` : null;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={String(book.id)}>
                      {book.title} — {book.author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.bookId]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="userId">Usuario</FieldLabel>
          <div className="flex gap-2">
            <Controller
              control={control}
              name="userId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "")}>
                  <SelectTrigger id="userId" className="flex-1" aria-invalid={!!errors.userId}>
                    <SelectValue placeholder={users.length === 0 ? "No hay usuarios registrados" : "Selecciona un usuario"}>
                      {(value: string | null) => {
                        const user = users.find((u) => String(u.id) === value);
                        return user ? `${user.name} (${user.email})` : null;
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <UserQuickCreateDialog
              onCreated={(user) => {
                refetchUsers();
                setValue("userId", String(user.id));
              }}
            />
          </div>
          <FieldError errors={[errors.userId]} />
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting || books.length === 0}>
          {isSubmitting ? "Registrando..." : "Registrar préstamo"}
        </Button>
      </div>
    </form>
  );
}
