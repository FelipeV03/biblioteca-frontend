import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLoan, listLoans, returnLoan, type CreateLoanInput, type ListLoansParams } from "@/lib/api/loans";

export function useLoans(params: ListLoansParams) {
  return useQuery({
    queryKey: ["loans", params],
    queryFn: () => listLoans(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLoanInput) => createLoan(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useReturnLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => returnLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
