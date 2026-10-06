"use client";

import { CheckCircle2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import type { Loan } from "@/types";
import { LoanStatusBadge } from "./loan-status-badge";

interface LoanTableProps {
  loans: Loan[];
  onReturn: (id: number) => Promise<void> | void;
  isReturning?: boolean;
}

export function LoanTable({ loans, onReturn, isReturning }: LoanTableProps) {
  if (loans.length === 0) {
    return (
      <div className="rounded-lg border">
        <EmptyState
          icon={ClipboardList}
          title="No hay préstamos registrados"
          description="Los préstamos que registres van a aparecer aquí."
        />
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="py-3">Libro</TableHead>
            <TableHead className="py-3">Usuario</TableHead>
            <TableHead className="py-3">Préstamo</TableHead>
            <TableHead className="py-3">Vencimiento</TableHead>
            <TableHead className="py-3">Estado</TableHead>
            <TableHead className="py-3 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell className="py-3 font-medium">{loan.book?.title ?? `#${loan.bookId}`}</TableCell>
              <TableCell className="py-3">{loan.user?.name ?? `#${loan.userId}`}</TableCell>
              <TableCell className="py-3">{loan.loanDate}</TableCell>
              <TableCell className="py-3">{loan.dueDate}</TableCell>
              <TableCell className="py-3">
                <LoanStatusBadge status={loan.displayStatus} />
              </TableCell>
              <TableCell className="py-3 text-right">
                {loan.displayStatus !== "returned" && (
                  <Button size="sm" onClick={() => onReturn(loan.id)} disabled={isReturning}>
                    <CheckCircle2 />
                    Devolver
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
