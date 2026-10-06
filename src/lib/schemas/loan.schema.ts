import { z } from "zod";

export const loanFormSchema = z.object({
  bookId: z.string().min(1, "Debes seleccionar un libro"),
  userId: z.string().min(1, "Debes seleccionar un usuario"),
});

export type LoanFormInput = z.infer<typeof loanFormSchema>;

export interface LoanFormValues {
  bookId: number;
  userId: number;
}
