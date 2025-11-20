import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Input from "../../../Components/Input/Input";

describe("Input component", () => {
  it("renderiza o label corretamente", () => {
    render(
      <Input
        label="Nome"
        name="nome"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Nome")).toBeInTheDocument();
  });

  it("renderiza o input com valor inicial", () => {
    render(
      <Input
        label="Email"
        name="email"
        value="teste@exemplo.com"
        onChange={() => {}}
      />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("teste@exemplo.com");
  });

  it("chama onChange quando o usuário digita", () => {
    const handleChange = vi.fn();

    render(
      <Input
        label="Usuário"
        name="usuario"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "rubens" } });

    expect(handleChange).toHaveBeenCalledOnce();
  });
});
