import { z } from "zod";

const currentYear = new Date().getFullYear();

export const bookFormSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(255),
  author: z.string().trim().min(1, "El autor es obligatorio").max(255),
  genre: z.string().trim().min(1, "El género es obligatorio").max(100),
  isbn: z
    .string()
    .trim()
    .max(20, "Máximo 20 caracteres")
    .optional()
    .or(z.literal("")),
  publishedYear: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^\d{1,4}$/.test(value), "Año inválido")
    .refine((value) => !value || Number(value) >= 1400, "Año inválido")
    .refine((value) => !value || Number(value) <= currentYear, "El año no puede ser futuro"),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;
