import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(255),
  email: z.string().trim().min(1, "El email es obligatorio").email("Email inválido").max(255),
  documentNumber: z
    .string()
    .trim()
    .min(5, "Debe tener al menos 5 dígitos")
    .max(20, "Máximo 20 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
