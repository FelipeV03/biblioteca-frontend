import { useQuery } from "@tanstack/react-query";
import { getAverageLoanDuration, getAvailabilityByGenre, getLoansSummary, getTopBooks } from "@/lib/api/stats";

export function useTopBooks(limit = 5) {
  return useQuery({
    queryKey: ["stats", "top-books", limit],
    queryFn: () => getTopBooks(limit),
  });
}

export function useLoansSummary() {
  return useQuery({
    queryKey: ["stats", "loans-summary"],
    queryFn: getLoansSummary,
  });
}

export function useAvailabilityByGenre() {
  return useQuery({
    queryKey: ["stats", "availability-by-genre"],
    queryFn: getAvailabilityByGenre,
  });
}

export function useAverageLoanDuration() {
  return useQuery({
    queryKey: ["stats", "average-loan-duration"],
    queryFn: getAverageLoanDuration,
  });
}
