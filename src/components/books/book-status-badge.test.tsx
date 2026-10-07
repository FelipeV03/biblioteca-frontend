import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookStatusBadge } from "./book-status-badge";

describe("BookStatusBadge", () => {
  it("muestra 'Disponible' cuando el libro está disponible", () => {
    render(<BookStatusBadge isAvailable={true} />);
    expect(screen.getByText("Disponible")).toBeInTheDocument();
  });

  it("muestra 'Prestado' sin fecha cuando no hay dueDate", () => {
    render(<BookStatusBadge isAvailable={false} />);
    expect(screen.getByText("Prestado")).toBeInTheDocument();
  });

  it("muestra la fecha de devolución cuando el libro está prestado y hay dueDate", () => {
    render(<BookStatusBadge isAvailable={false} dueDate="2026-10-20" />);
    expect(screen.getByText(/Prestado · vence/)).toBeInTheDocument();
  });

  it("ignora dueDate si el libro está disponible", () => {
    render(<BookStatusBadge isAvailable={true} dueDate="2026-10-20" />);
    expect(screen.getByText("Disponible")).toBeInTheDocument();
    expect(screen.queryByText(/vence/)).not.toBeInTheDocument();
  });
});
