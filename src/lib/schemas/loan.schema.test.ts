import { describe, expect, it } from "vitest";
import { loanFormSchema } from "./loan.schema";

describe("loanFormSchema", () => {
  it("acepta un libro y un usuario seleccionados", () => {
    const result = loanFormSchema.safeParse({ bookId: "3", userId: "7" });
    expect(result.success).toBe(true);
  });

  it("rechaza si no se seleccionó un libro", () => {
    const result = loanFormSchema.safeParse({ bookId: "", userId: "7" });
    expect(result.success).toBe(false);
  });

  it("rechaza si no se seleccionó un usuario", () => {
    const result = loanFormSchema.safeParse({ bookId: "3", userId: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza si faltan ambos campos", () => {
    const result = loanFormSchema.safeParse({ bookId: "", userId: "" });
    expect(result.success).toBe(false);
  });
});
