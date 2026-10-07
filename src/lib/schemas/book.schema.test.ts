import { describe, expect, it } from "vitest";
import { bookFormSchema } from "./book.schema";

const validBook = {
  title: "Cien años de soledad",
  author: "Gabriel García Márquez",
  genre: "Narrativa",
  isbn: "978-0307474728",
  publishedYear: "1967",
};

describe("bookFormSchema", () => {
  it("acepta un libro válido completo", () => {
    const result = bookFormSchema.safeParse(validBook);
    expect(result.success).toBe(true);
  });

  it("acepta un libro válido sin ISBN ni año (son opcionales)", () => {
    const result = bookFormSchema.safeParse({
      title: "Ficciones",
      author: "Jorge Luis Borges",
      genre: "Narrativa",
      isbn: "",
      publishedYear: "",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza si falta el título", () => {
    const result = bookFormSchema.safeParse({ ...validBook, title: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza si falta el autor", () => {
    const result = bookFormSchema.safeParse({ ...validBook, author: "   " });
    expect(result.success).toBe(false);
  });

  it("rechaza si falta el género", () => {
    const result = bookFormSchema.safeParse({ ...validBook, genre: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza un año de publicación futuro", () => {
    const nextYear = String(new Date().getFullYear() + 1);
    const result = bookFormSchema.safeParse({ ...validBook, publishedYear: nextYear });
    expect(result.success).toBe(false);
  });

  it("rechaza un año de publicación anterior a 1400", () => {
    const result = bookFormSchema.safeParse({ ...validBook, publishedYear: "1399" });
    expect(result.success).toBe(false);
  });

  it("rechaza un año con letras", () => {
    const result = bookFormSchema.safeParse({ ...validBook, publishedYear: "19ab" });
    expect(result.success).toBe(false);
  });

  it("rechaza un ISBN de más de 20 caracteres", () => {
    const result = bookFormSchema.safeParse({ ...validBook, isbn: "1".repeat(21) });
    expect(result.success).toBe(false);
  });
});
