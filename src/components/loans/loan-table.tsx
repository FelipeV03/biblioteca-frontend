"use client";

import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import type { Loan } from "@/types";
import { LoanStatusBadge } from "./loan-status-badge";

interface LoanTableProps {
  loans: Loan[];
  onReturn: (id: number) => Promise<void> | void;
  isReturning?: boolean;
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(isoDate),
  );
}

function ReturnAction({ loan, isOverdue, onReturn, isReturning }: {
  loan: Loan;
  isOverdue: boolean;
  onReturn: (id: number) => Promise<void> | void;
  isReturning?: boolean;
}) {
  if (loan.displayStatus === "returned") {
    return <span className="text-muted-foreground select-none">—</span>;
  }

  return (
    <Button
      variant={isOverdue ? "destructive" : "outline"}
      size="sm"
      onClick={() => onReturn(loan.id)}
      disabled={isReturning}
    >
      Marcar devolución
    </Button>
  );
}

export function LoanTable({ loans, onReturn, isReturning }: LoanTableProps) {
  if (loans.length === 0) {
    return (
      <div className="rounded-lg border bg-card">
        <EmptyState
          icon={ClipboardList}
          title="No hay préstamos registrados"
          description="Los préstamos que registres van a aparecer aquí."
        />
      </div>
    );
  }

  return (
    <>
      {/* Mobile: stacked cards, no horizontal scroll */}
      <div className="flex flex-col gap-3 md:hidden">
        {loans.map((loan) => {
          const isOverdue = loan.displayStatus === "overdue";

          return (
            <div
              key={loan.id}
              className={cn("flex flex-col gap-3 rounded-lg border bg-card p-4", isOverdue && "border-destructive/30 bg-destructive/5")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-foreground">{loan.book?.title ?? `Libro #${loan.bookId}`}</div>
                  {loan.book?.isbn && (
                    <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">ISBN: {loan.book.isbn}</div>
                  )}
                </div>
                <LoanStatusBadge status={loan.displayStatus} />
              </div>
              <div className="text-sm text-muted-foreground">{loan.user?.name ?? `Usuario #${loan.userId}`}</div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Préstamo: {formatDate(loan.loanDate)}</span>
                <span className={cn(isOverdue && "font-semibold text-destructive")}>
                  Límite: {formatDate(loan.dueDate)}
                </span>
              </div>
              <div className="flex justify-end">
                <ReturnAction loan={loan} isOverdue={isOverdue} onReturn={onReturn} isReturning={isReturning} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop/tablet: table */}
      <div className="hidden min-w-0 overflow-hidden rounded-lg border bg-card md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Libro
                </TableHead>
                <TableHead className="py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Usuario
                </TableHead>
                <TableHead className="py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Fecha de préstamo
                </TableHead>
                <TableHead className="py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Fecha límite
                </TableHead>
                <TableHead className="py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Estado
                </TableHead>
                <TableHead className="py-2.5 text-right text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => {
                const isOverdue = loan.displayStatus === "overdue";

                return (
                  <TableRow key={loan.id} className={cn(isOverdue && "bg-destructive/5")}>
                    <TableCell className="py-3">
                      <div className="font-medium text-foreground">{loan.book?.title ?? `Libro #${loan.bookId}`}</div>
                      {loan.book?.isbn && (
                        <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">ISBN: {loan.book.isbn}</div>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-foreground">{loan.user?.name ?? `Usuario #${loan.userId}`}</TableCell>
                    <TableCell className="py-3">{formatDate(loan.loanDate)}</TableCell>
                    <TableCell className={cn("py-3", isOverdue && "font-semibold text-destructive")}>
                      {formatDate(loan.dueDate)}
                    </TableCell>
                    <TableCell className="py-3">
                      <LoanStatusBadge status={loan.displayStatus} />
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <ReturnAction loan={loan} isOverdue={isOverdue} onReturn={onReturn} isReturning={isReturning} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
