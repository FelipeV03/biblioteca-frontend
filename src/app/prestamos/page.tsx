"use client";

import Link from "next/link";
import { useState } from "react";
import { Package, Plus } from "lucide-react";
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
import { PageHeader } from "@/components/layout/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { useLoans, useReturnLoan } from "@/hooks/useLoans";
import { ApiError } from "@/lib/api/client";
import type { LoanDisplayStatus } from "@/types";

const statusLabels: Record<string, string> = {
  all: "Todos los estados",
  active: "Activos",
  overdue: "Vencidos",
  returned: "Devueltos",
};

const PAGE_SIZE = 10;

export default function PrestamosPage() {
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useLoans({
    status: status === "all" ? undefined : (status as LoanDisplayStatus),
    page,
    limit: PAGE_SIZE,
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

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.meta.total / data.meta.limit)) : 1;
  const rangeStart = data && data.meta.total > 0 ? (page - 1) * data.meta.limit + 1 : 0;
  const rangeEnd = data ? Math.min(data.meta.total, page * data.meta.limit) : 0;

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-[1600px] flex-1 flex-col gap-6 p-6 sm:p-8">
      <PageHeader
        title="Préstamos"
        description="Registra préstamos y marca devoluciones."
        action={
          <Button render={<Link href="/prestamos/nuevo" />}>
            <Plus />
            Nuevo préstamo
          </Button>
        }
      />

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={status} onValueChange={(value) => handleStatusChange(value ?? "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Estado">
              {(value: string | null) => statusLabels[value ?? "all"] ?? "Estado"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="overdue">Vencidos</SelectItem>
            <SelectItem value="returned">Devueltos</SelectItem>
          </SelectContent>
        </Select>

        {data && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Package className="size-3.5" />
            <span>
              Mostrando {rangeStart}–{rangeEnd} de {data.meta.total.toLocaleString("es-ES")} préstamos registrados
            </span>
          </div>
        )}
      </div>

      {isLoading && <TableSkeleton columns={6} />}

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof ApiError ? error.message : "No se pudo conectar con el servidor"}
        </p>
      )}

      {data && (
        <>
          <LoanTable loans={data.data} onReturn={handleReturn} isReturning={returnLoan.isPending} />

          <div className="flex items-center justify-end">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </main>
  );
}
