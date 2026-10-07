import { Check, TriangleAlert } from "lucide-react";
import type { LoanDisplayStatus } from "@/types";

export function LoanStatusBadge({ status }: { status: LoanDisplayStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
        <span className="size-1.5 rounded-full bg-primary" />
        Activo
      </span>
    );
  }

  if (status === "overdue") {
    return (
      <span className="inline-flex items-center gap-1 rounded border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
        <TriangleAlert className="size-3" />
        Vencido
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium text-muted-foreground">
      <Check className="size-3" />
      Devuelto
    </span>
  );
}
