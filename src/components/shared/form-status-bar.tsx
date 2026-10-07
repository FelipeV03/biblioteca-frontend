export function FormStatusBar({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b bg-muted/40 px-6 py-2.5 text-xs text-muted-foreground">
      <span className="size-2 rounded-full bg-primary" />
      <span>{label}</span>
    </div>
  );
}
