"use client";

import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/lib/api/health";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  });

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sistema de Biblioteca</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Estado del backend:</p>
          {isLoading && <Badge variant="secondary">Comprobando...</Badge>}
          {isError && (
            <Badge variant="destructive">
              Sin conexión: {error instanceof Error ? error.message : "error desconocido"}
            </Badge>
          )}
          {data && <Badge>{data.data.status}</Badge>}
        </CardContent>
      </Card>
    </div>
  );
}
