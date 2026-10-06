"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { LoanForm } from "@/components/loans/loan-form";
import { PageHeader } from "@/components/layout/page-header";
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
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo registrar el préstamo");
    }
  }

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-lg flex-1 flex-col gap-6 p-6 sm:p-8">
      <PageHeader title="Nuevo préstamo" description="Selecciona el libro y el usuario para registrar el préstamo." />
      <Card>
        <CardContent>
          <LoanForm onSubmit={handleSubmit} isSubmitting={createLoan.isPending} />
        </CardContent>
      </Card>
    </main>
  );
}
