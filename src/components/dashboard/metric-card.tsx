import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  caption: string;
  tone?: "default" | "destructive";
}

export function MetricCard({ label, value, icon: Icon, caption, tone = "default" }: MetricCardProps) {
  const isDestructive = tone === "destructive";

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        isDestructive ? "border-destructive/30 bg-destructive/5" : "border-border bg-card",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between",
          isDestructive ? "text-destructive" : "text-muted-foreground",
        )}
      >
        <span className="text-sm font-medium">{label}</span>
        <Icon className={cn("size-[18px]", isDestructive && "text-destructive")} />
      </div>
      <div
        className={cn(
          "mt-2 text-[28px] font-semibold tracking-tight",
          isDestructive ? "text-destructive" : "text-foreground",
        )}
      >
        {value}
      </div>
      {isDestructive ? (
        <span className="mt-2 inline-flex items-center rounded border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-[11px] font-medium text-destructive">
          {caption}
        </span>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
      )}
    </div>
  );
}
