import { BookEditView } from "@/components/books/book-edit-view";

export default async function EditarLibroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Editar libro</h1>
      <BookEditView id={Number(id)} />
    </main>
  );
}
