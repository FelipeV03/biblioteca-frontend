"use client";

import { useState } from "react";
import Link from "next/link";
import { BookX, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import type { Book } from "@/types";
import { BookStatusBadge } from "./book-status-badge";

interface BookTableProps {
  books: Book[];
  onDelete: (id: number) => Promise<void> | void;
  isDeleting?: boolean;
}

export function BookTable({ books, onDelete, isDeleting }: BookTableProps) {
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  async function handleConfirmDelete() {
    if (!bookToDelete) return;
    await onDelete(bookToDelete.id);
    setBookToDelete(null);
  }

  if (books.length === 0) {
    return (
      <div className="rounded-lg border">
        <EmptyState
          icon={BookX}
          title="No hay libros registrados"
          description="Agrega el primer libro para empezar a gestionar tu biblioteca."
        />
      </div>
    );
  }

  return (
    <>
      <div className="min-w-0 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="py-3">Título</TableHead>
              <TableHead className="py-3">Autor</TableHead>
              <TableHead className="py-3">Género</TableHead>
              <TableHead className="py-3">Estado</TableHead>
              <TableHead className="py-3 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="py-3 font-medium">{book.title}</TableCell>
                <TableCell className="py-3">{book.author}</TableCell>
                <TableCell className="py-3">{book.genre}</TableCell>
                <TableCell className="py-3">
                  <BookStatusBadge isAvailable={book.isAvailable} />
                </TableCell>
                <TableCell className="flex justify-end gap-2 py-3">
                  <Button variant="outline" size="sm" render={<Link href={`/libros/${book.id}/editar`} />}>
                    <Pencil />
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setBookToDelete(book)}>
                    <Trash2 />
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!bookToDelete} onOpenChange={(open) => !open && setBookToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar libro</DialogTitle>
            <DialogDescription>
              ¿Seguro que quieres eliminar &quot;{bookToDelete?.title}&quot;? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
