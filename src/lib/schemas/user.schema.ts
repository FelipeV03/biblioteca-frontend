import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(255),
  email: z.string().trim().min(1, "El email es obligatorio").email("Email inválido").max(255),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
