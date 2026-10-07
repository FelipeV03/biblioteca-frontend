import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface QuickAccessCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  footerLabel: string;
  footerCta: string;
}

export function QuickAccessCard({
  href,
  icon: Icon,
  title,
  description,
  badge,
  footerLabel,
  footerCta,
}: QuickAccessCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-xl border bg-card p-5 transition-colors hover:border-foreground/20 focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Icon className="size-[22px] text-primary" />
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <span className="shrink-0 rounded border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
          {badge}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
        <span className="text-xs text-muted-foreground">{footerLabel}</span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
          {footerCta}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
