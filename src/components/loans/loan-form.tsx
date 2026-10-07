"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, CalendarCheck, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBooks } from "@/hooks/useBooks";
import { useUsers } from "@/hooks/useUsers";
import { listLoans } from "@/lib/api/loans";
import { loanFormSchema, type LoanFormInput, type LoanFormValues } from "@/lib/schemas/loan.schema";
import { UserQuickCreateDialog } from "./user-quick-create-dialog";

interface LoanFormProps {
  onSubmit: (values: LoanFormValues) => Promise<boolean | void> | boolean | void;
  isSubmitting?: boolean;
}

// Reglas fijas del backend (loan.service.ts): el período y el límite no son configurables.
const LOAN_PERIOD_DAYS = 14;
const MAX_ACTIVE_LOANS_PER_USER = 2;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  );
}

export function LoanForm({ onSubmit, isSubmitting }: LoanFormProps) {
  const { data: booksData, isLoading: isLoadingBooks } = useBooks({ available: true, limit: 100 });
  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useUsers();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LoanFormInput>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: { bookId: "", userId: "" },
  });

  const books = booksData?.data ?? [];
  const users = usersData?.data ?? [];

  const bookIdValue = useWatch({ control, name: "bookId" });
  const userIdValue = useWatch({ control, name: "userId" });

  const selectedBook = books.find((book) => String(book.id) === bookIdValue);
  const selectedUser = users.find((user) => String(user.id) === userIdValue);
  const selectedUserId = userIdValue ? Number(userIdValue) : undefined;

  const activeLoansForUser = useQuery({
    queryKey: ["loans", "active-by-user", selectedUserId],
    queryFn: () => listLoans({ userId: selectedUserId, status: "active", limit: MAX_ACTIVE_LOANS_PER_USER + 5 }),
    enabled: !!selectedUserId,
  });

  const activeLoanCount = activeLoansForUser.data?.meta.total;
  const reachedLoanLimit = activeLoanCount !== undefined && activeLoanCount >= MAX_ACTIVE_LOANS_PER_USER;

  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    // Next.js flags `new Date()` read during render as an unstable prerender value;
    // this defers it to the client only, as Next's own error message recommends.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(new Date());
  }, []);

  const dueDate = today ? new Date(today) : null;
  if (dueDate) {
    dueDate.setDate(dueDate.getDate() + LOAN_PERIOD_DAYS);
  }

  async function handleFormSubmit(values: LoanFormInput) {
    const succeeded = await onSubmit({ bookId: Number(values.bookId), userId: Number(values.userId) });
    if (succeeded === true) {
      reset();
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 p-6 md:p-8">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="bookId">
            Libro a prestar <RequiredMark />
          </FieldLabel>
          <Controller
            control={control}
            name="bookId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "")}>
                <SelectTrigger id="bookId" className="w-full min-w-0" aria-invalid={!!errors.bookId}>
                  <SelectValue
                    placeholder={
                      isLoadingBooks
                        ? "Cargando libros..."
                        : books.length === 0
                          ? "No hay libros disponibles"
                          : "Selecciona un libro"
                    }
                  >
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
          <FieldDescription>Solo se muestran libros con copia disponible.</FieldDescription>
          <FieldError errors={[errors.bookId]} />

          {selectedBook && (
            <div className="mt-1 flex items-start gap-3 rounded-lg border bg-muted/30 p-3.5">
              <div className="mt-0.5 rounded border bg-card p-2 text-primary">
                <BookOpen className="size-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-medium text-foreground">
                  {selectedBook.title} <span className="font-normal text-muted-foreground">— {selectedBook.author}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-muted-foreground">
                  <span>{selectedBook.genre}</span>
                  {selectedBook.isbn && (
                    <>
                      <span>·</span>
                      <span>ISBN: {selectedBook.isbn}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </Field>

        <div className="border-t pt-5" />

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="userId">
              Usuario / Lector <RequiredMark />
            </FieldLabel>
            <UserQuickCreateDialog
              onCreated={(user) => {
                refetchUsers();
                setValue("userId", String(user.id));
              }}
            />
          </div>
          <Controller
            control={control}
            name="userId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "")}>
                <SelectTrigger id="userId" className="w-full min-w-0" aria-invalid={!!errors.userId}>
                  <SelectValue
                    placeholder={
                      isLoadingUsers
                        ? "Cargando usuarios..."
                        : users.length === 0
                          ? "No hay usuarios registrados"
                          : "Selecciona un usuario"
                    }
                  >
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
          <FieldError errors={[errors.userId]} />

          {selectedUser && (
            <div
              className={`flex flex-col gap-1 rounded-lg border px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-2 ${
                reachedLoanLimit ? "border-destructive/30 bg-destructive/5" : "bg-muted/30"
              }`}
            >
              <span className="truncate text-muted-foreground">{selectedUser.email}</span>
              <span
                className={`shrink-0 ${reachedLoanLimit ? "font-medium text-destructive" : "text-muted-foreground"}`}
              >
                {activeLoansForUser.isLoading
                  ? "Verificando préstamos activos..."
                  : `Préstamos activos: ${activeLoanCount ?? 0}/${MAX_ACTIVE_LOANS_PER_USER}`}
              </span>
            </div>
          )}
        </Field>

        <div className="border-t pt-5" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel>Fecha de préstamo</FieldLabel>
            <div className="flex h-9 items-center gap-2 rounded-lg border bg-muted/30 px-3 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              {today ? `${formatDate(today)} (hoy)` : "Calculando..."}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <FieldLabel>Fecha límite de devolución</FieldLabel>
              <span className="text-[11px] font-medium text-primary">{LOAN_PERIOD_DAYS} días</span>
            </div>
            <div className="flex h-9 items-center gap-2 rounded-lg border bg-muted/30 px-3 text-sm text-muted-foreground">
              <CalendarCheck className="size-4" />
              {dueDate ? formatDate(dueDate) : "Calculando..."}
            </div>
          </div>
        </div>
        <p className="-mt-2 text-xs text-muted-foreground">
          Estas fechas se calculan automáticamente al registrar el préstamo.
        </p>
      </FieldGroup>

      <div className="flex items-start gap-2.5 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          Cada usuario puede tener máximo {MAX_ACTIVE_LOANS_PER_USER} préstamos activos a la vez. El período de
          préstamo es de {LOAN_PERIOD_DAYS} días.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 border-t pt-6">
        <Button type="submit" disabled={isSubmitting || isLoadingBooks || books.length === 0}>
          <CheckCircle2 />
          {isSubmitting ? "Registrando..." : "Registrar préstamo"}
        </Button>
      </div>
    </form>
  );
}
