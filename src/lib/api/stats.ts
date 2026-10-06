import type { AverageLoanDuration, GenreAvailability, LoansSummary, TopBook } from "@/types";
import { apiClient } from "./client";

export function getTopBooks(limit = 5) {
  return apiClient<{ data: TopBook[] }>(`/stats/top-books?limit=${limit}`);
}

export function getLoansSummary() {
  return apiClient<{ data: LoansSummary }>("/stats/loans-summary");
}

export function getAvailabilityByGenre() {
  return apiClient<{ data: GenreAvailability[] }>("/stats/availability-by-genre");
}

export function getAverageLoanDuration() {
  return apiClient<{ data: AverageLoanDuration }>("/stats/average-loan-duration");
}
