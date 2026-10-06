import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
  type BookInput,
  type ListBooksParams,
  type UpdateBookInput,
} from "@/lib/api/books";

export function useBooks(params: ListBooksParams) {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => listBooks(params),
  });
}

export function useBook(id: number) {
  return useQuery({
    queryKey: ["books", id],
    queryFn: () => getBook(id),
    enabled: Number.isFinite(id),
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BookInput) => createBook(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });
}

export function useUpdateBook(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateBookInput) => updateBook(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });
}
