import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoanStatusBadge } from "./loan-status-badge";

describe("LoanStatusBadge", () => {
  it("muestra 'Activo' para un préstamo activo", () => {
    render(<LoanStatusBadge status="active" />);
    expect(screen.getByText("Activo")).toBeInTheDocument();
  });

  it("muestra 'Vencido' para un préstamo vencido", () => {
    render(<LoanStatusBadge status="overdue" />);
    expect(screen.getByText("Vencido")).toBeInTheDocument();
  });

  it("muestra 'Devuelto' para un préstamo devuelto", () => {
    render(<LoanStatusBadge status="returned" />);
    expect(screen.getByText("Devuelto")).toBeInTheDocument();
  });
});
