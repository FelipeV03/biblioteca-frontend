"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoanTable } from "@/components/loans/loan-table";
import { useLoans, useReturnLoan } from "@/hooks/useLoans";
import { ApiError } from "@/lib/api/client";
import type { LoanDisplayStatus } from "@/types";

const statusLabels: Record<string, string> = {
  all: "Todos",
  active: "Activos",
  overdue: "Vencidos",
  returned: "Devueltos",
};

export default function PrestamosPage() {
  const [status, setStatus] = useState<string>("all");

  const { data, isLoading, isError, error } = useLoans({
    status: status === "all" ? undefined : (status as LoanDisplayStatus),
    limit: 50,
  });

  const returnLoan = useReturnLoan();

  async function handleReturn(id: number) {
    try {
      await returnLoan.mutateAsync(id);
      toast.success("Préstamo marcado como devuelto");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo registrar la devolución");
    }
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Préstamos</h1>
        <Button render={<Link href="/prestamos/nuevo" />}>Nuevo préstamo</Button>
      </div>

      <Select value={status} onValueChange={(value) => setStatus(value ?? "all")}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Estado">
            {(value: string | null) => statusLabels[value ?? "all"] ?? "Estado"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="overdue">Vencidos</SelectItem>
          <SelectItem value="returned">Devueltos</SelectItem>
        </SelectContent>
      </Select>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando préstamos...</p>}

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof ApiError ? error.message : "No se pudo conectar con el servidor"}
        </p>
      )}

      {data && <LoanTable loans={data.data} onReturn={handleReturn} isReturning={returnLoan.isPending} />}
    </main>
  );
}
