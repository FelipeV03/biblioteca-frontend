"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Loan } from "@/types";
import { LoanStatusBadge } from "./loan-status-badge";

interface LoanTableProps {
  loans: Loan[];
  onReturn: (id: number) => Promise<void> | void;
  isReturning?: boolean;
}

export function LoanTable({ loans, onReturn, isReturning }: LoanTableProps) {
  if (loans.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No hay préstamos registrados.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libro</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Préstamo</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell className="font-medium">{loan.book?.title ?? `#${loan.bookId}`}</TableCell>
              <TableCell>{loan.user?.name ?? `#${loan.userId}`}</TableCell>
              <TableCell>{loan.loanDate}</TableCell>
              <TableCell>{loan.dueDate}</TableCell>
              <TableCell>
                <LoanStatusBadge status={loan.displayStatus} />
              </TableCell>
              <TableCell className="text-right">
                {loan.displayStatus !== "returned" && (
                  <Button size="sm" onClick={() => onReturn(loan.id)} disabled={isReturning}>
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
