"use client";

import { useState } from "react";
import Link from "next/link";
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
    return <p className="py-8 text-center text-sm text-muted-foreground">No hay libros registrados.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Género</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>
                  <BookStatusBadge isAvailable={book.isAvailable} />
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" render={<Link href={`/libros/${book.id}/editar`} />}>
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setBookToDelete(book)}>
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
