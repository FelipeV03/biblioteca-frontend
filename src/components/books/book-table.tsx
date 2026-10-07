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
  dueDatesByBookId?: Record<number, string>;
  onDelete: (id: number) => Promise<void> | void;
  isDeleting?: boolean;
}

function BookRowActions({ book, onDeleteClick }: { book: Book; onDeleteClick: () => void }) {
  return (
    <div className="inline-flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Editar ${book.title}`}
        render={<Link href={`/libros/${book.id}/editar`} />}
      >
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Eliminar ${book.title}`}
        className="hover:bg-destructive/10 hover:text-destructive"
        onClick={onDeleteClick}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

export function BookTable({ books, dueDatesByBookId, onDelete, isDeleting }: BookTableProps) {
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  async function handleConfirmDelete() {
    if (!bookToDelete) return;
    await onDelete(bookToDelete.id);
    setBookToDelete(null);
  }

  if (books.length === 0) {
    return (
      <div className="rounded-lg border bg-card">
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
      {/* Mobile: stacked cards, no horizontal scroll */}
      <div className="flex flex-col gap-3 md:hidden">
        {books.map((book) => (
          <div key={book.id} className="flex flex-col gap-3 rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-foreground">{book.title}</div>
                {book.isbn && (
                  <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">ISBN: {book.isbn}</div>
                )}
              </div>
              <BookRowActions book={book} onDeleteClick={() => setBookToDelete(book)} />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{book.author}</span>
              <span className="inline-flex items-center rounded border px-2 py-0.5 text-xs">{book.genre}</span>
            </div>
            <div className="self-start">
              <BookStatusBadge isAvailable={book.isAvailable} dueDate={dueDatesByBookId?.[book.id]} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/tablet: table */}
      <div className="hidden min-w-0 overflow-hidden rounded-lg border bg-card md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Título
                </TableHead>
                <TableHead className="py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Autor
                </TableHead>
                <TableHead className="py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Género
                </TableHead>
                <TableHead className="py-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Estado
                </TableHead>
                <TableHead className="py-2.5 text-right text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="py-3">
                    <div className="font-medium text-foreground">{book.title}</div>
                    {book.isbn && (
                      <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">ISBN: {book.isbn}</div>
                    )}
                  </TableCell>
                  <TableCell className="py-3">{book.author}</TableCell>
                  <TableCell className="py-3">
                    <span className="inline-flex items-center rounded border px-2 py-0.5 text-xs text-muted-foreground">
                      {book.genre}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <BookStatusBadge isAvailable={book.isAvailable} dueDate={dueDatesByBookId?.[book.id]} />
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <BookRowActions book={book} onDeleteClick={() => setBookToDelete(book)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
