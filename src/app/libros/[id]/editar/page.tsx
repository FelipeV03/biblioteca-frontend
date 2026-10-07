import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookEditView } from "@/components/books/book-edit-view";

// Esta ruta depende de datos reales del libro (no puede ser "instantánea"):
// optamos fuera de la validación de instant-navigation de Next en vez de forzar
// un Suspense artificial que no aporta nada aquí.
export const instant = false;

export default async function EditarLibroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 flex-col gap-6 p-6 sm:p-8">
      <Link
        href="/libros"
        className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Volver al catálogo
      </Link>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Editar libro</h1>
        <p className="mt-1 text-sm text-muted-foreground">Actualiza la información del libro.</p>
      </div>

      <BookEditView id={Number(id)} />
    </main>
  );
}
