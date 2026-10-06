"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GenreAvailability } from "@/types";

export function GenreAvailabilityChart({ data }: { data: GenreAvailability[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disponibilidad por género</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aún no hay libros registrados.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="genre"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--popover-foreground)",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }} />
                <Bar dataKey="available" name="Disponibles" stackId="books" fill="var(--chart-1)" radius={[0, 0, 0, 0]} />
                <Bar
                  dataKey="borrowed"
                  name="Prestados"
                  stackId="books"
                  fill="var(--chart-4)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
