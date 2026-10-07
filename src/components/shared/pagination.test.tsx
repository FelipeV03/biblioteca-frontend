import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("no renderiza nada si hay 1 página o menos", () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("muestra los números de página y marca la página actual", () => {
    render(<Pagination page={2} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("deshabilita 'Página anterior' en la primera página", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Página siguiente" })).toBeEnabled();
  });

  it("deshabilita 'Página siguiente' en la última página", () => {
    render(<Pagination page={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Página siguiente" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeEnabled();
  });

  it("llama a onPageChange con el número correcto al hacer click en una página", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "2" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("llama a onPageChange al hacer click en 'Página siguiente'", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Página siguiente" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("muestra puntos suspensivos cuando hay muchas páginas entre medio", () => {
    render(<Pagination page={5} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
    expect(screen.getAllByText("…").length).toBeGreaterThan(0);
  });
});
