import { BookEditView } from "@/components/books/book-edit-view";
import { PageHeader } from "@/components/layout/page-header";

export default async function EditarLibroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-lg flex-1 flex-col gap-6 p-6 sm:p-8">
      <PageHeader title="Editar libro" description="Actualiza la información del libro." />
      <BookEditView id={Number(id)} />
    </main>
  );
}
