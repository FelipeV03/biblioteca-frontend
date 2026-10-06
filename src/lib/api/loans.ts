import type { Loan, LoanDisplayStatus, Paginated } from "@/types";
import { apiClient, buildQuery } from "./client";

export interface ListLoansParams {
  status?: LoanDisplayStatus;
  userId?: number;
  bookId?: number;
  page?: number;
  limit?: number;
}

export interface CreateLoanInput {
  bookId: number;
  userId: number;
}

export function listLoans(params: ListLoansParams = {}) {
  return apiClient<Paginated<Loan>>(`/loans${buildQuery(params)}`);
}

export function getLoan(id: number) {
  return apiClient<{ data: Loan }>(`/loans/${id}`);
}

export function createLoan(input: CreateLoanInput) {
  return apiClient<{ data: Loan }>("/loans", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function returnLoan(id: number) {
  return apiClient<{ data: Loan }>(`/loans/${id}/return`, { method: "PATCH" });
}
