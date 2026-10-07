import { describe, expect, it } from "vitest";
import { userFormSchema } from "./user.schema";

const validUser = {
  name: "Ana Martínez",
  email: "ana@email.com",
  documentNumber: "48920114",
};

describe("userFormSchema", () => {
  it("acepta un usuario válido", () => {
    const result = userFormSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it("rechaza si falta el nombre", () => {
    const result = userFormSchema.safeParse({ ...validUser, name: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza un email inválido", () => {
    const result = userFormSchema.safeParse({ ...validUser, email: "no-es-un-email" });
    expect(result.success).toBe(false);
  });

  it("rechaza un número de documento con letras", () => {
    const result = userFormSchema.safeParse({ ...validUser, documentNumber: "48920114K" });
    expect(result.success).toBe(false);
  });

  it("rechaza un número de documento demasiado corto", () => {
    const result = userFormSchema.safeParse({ ...validUser, documentNumber: "123" });
    expect(result.success).toBe(false);
  });

  it("rechaza un número de documento demasiado largo", () => {
    const result = userFormSchema.safeParse({ ...validUser, documentNumber: "1".repeat(21) });
    expect(result.success).toBe(false);
  });

  it("rechaza si falta el número de documento", () => {
    const result = userFormSchema.safeParse({ ...validUser, documentNumber: "" });
    expect(result.success).toBe(false);
  });
});
