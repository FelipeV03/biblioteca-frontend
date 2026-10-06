import type { Book, Paginated } from "@/types";
import { apiClient, buildQuery } from "./client";

export interface ListBooksParams {
  genre?: string;
  available?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface BookInput {
  title: string;
  author: string;
  genre: string;
  isbn?: string;
  publishedYear?: number;
}

export type UpdateBookInput = Partial<Omit<BookInput, "isbn" | "publishedYear">> & {
  isbn?: string | null;
  publishedYear?: number | null;
  isAvailable?: boolean;
};

export function listBooks(params: ListBooksParams = {}) {
  return apiClient<Paginated<Book>>(`/books${buildQuery(params)}`);
}

export function getBook(id: number) {
  return apiClient<{ data: Book }>(`/books/${id}`);
}

export function createBook(input: BookInput) {
  return apiClient<{ data: Book }>("/books", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateBook(id: number, input: UpdateBookInput) {
  return apiClient<{ data: Book }>(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteBook(id: number) {
  return apiClient<void>(`/books/${id}`, { method: "DELETE" });
}
