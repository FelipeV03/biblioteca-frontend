import { Badge } from "@/components/ui/badge";

export function BookStatusBadge({ isAvailable }: { isAvailable: boolean }) {
  return (
    <Badge variant={isAvailable ? "default" : "secondary"}>
      {isAvailable ? "Disponible" : "Prestado"}
    </Badge>
  );
}
