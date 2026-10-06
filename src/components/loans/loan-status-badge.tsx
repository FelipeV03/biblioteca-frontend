import { Badge } from "@/components/ui/badge";
import type { LoanDisplayStatus } from "@/types";

const labels: Record<LoanDisplayStatus, string> = {
  active: "Activo",
  overdue: "Vencido",
  returned: "Devuelto",
};

const variants: Record<LoanDisplayStatus, "default" | "destructive" | "secondary"> = {
  active: "default",
  overdue: "destructive",
  returned: "secondary",
};

export function LoanStatusBadge({ status }: { status: LoanDisplayStatus }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
