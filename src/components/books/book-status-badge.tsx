interface BookStatusBadgeProps {
  isAvailable: boolean;
  dueDate?: string | null;
}

export function BookStatusBadge({ isAvailable, dueDate }: BookStatusBadgeProps) {
  if (isAvailable) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        <span className="size-1.5 rounded-full bg-muted-foreground/50" />
        Disponible
      </span>
    );
  }

  const formattedDueDate = dueDate
    ? new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(new Date(dueDate))
    : null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
      <span className="size-1.5 rounded-full bg-primary" />
      {formattedDueDate ? `Prestado · vence ${formattedDueDate}` : "Prestado"}
    </span>
  );
}
