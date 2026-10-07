"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { LoanForm } from "@/components/loans/loan-form";
import { FormStatusBar } from "@/components/shared/form-status-bar";
import { useCreateLoan } from "@/hooks/useLoans";
import { ApiError } from "@/lib/api/client";
import type { LoanFormValues } from "@/lib/schemas/loan.schema";

export default function NuevoPrestamoPage() {
  const router = useRouter();
  const createLoan = useCreateLoan();

  async function handleSubmit(values: LoanFormValues) {
    try {
      await createLoan.mutateAsync(values);
      toast.success("Préstamo registrado correctamente");
      router.push("/prestamos");
      return true;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo registrar el préstamo");
      return false;
    }
  }

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <Link
        href="/prestamos"
        className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Volver a préstamos
      </Link>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Nuevo préstamo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecciona el libro y el usuario para registrar el préstamo.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <FormStatusBar label="Nuevo registro de préstamo" />
        <LoanForm onSubmit={handleSubmit} isSubmitting={createLoan.isPending} />
      </div>
    </main>
  );
}
