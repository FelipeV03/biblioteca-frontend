import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  tone?: "default" | "destructive" | "muted";
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-foreground",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
};

export function StatCard({ label, value, tone = "default" }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-normal text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn("text-3xl font-semibold", toneClasses[tone])}>{value}</p>
      </CardContent>
    </Card>
  );
}
