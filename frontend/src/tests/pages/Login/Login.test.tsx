import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Login from "../../../pages/Login/Login";

vi.mock("react-router-dom", () => ({
  useSearchParams: () => [
    {
      get: (key: string) => {
        if (key === "type") return mockType;
        return null;
      },
    },
  ],
}));

let mockType: string | null = "aluno";

const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

describe("LoginPage", () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  test("mostra mensagem de erro quando type é inválido", () => {
    mockType = null;

    render(<Login />);

    expect(screen.getByText("Tipo de usuário inválido.")).toBeInTheDocument();
  });

  test("renderiza campo de matrícula quando type=aluno", () => {
    mockType = "aluno";

    render(<Login />);

    expect(screen.getByText("Matrícula")).toBeInTheDocument();
  });

  test("renderiza email e senha quando type=professor", () => {
    mockType = "professor";

    render(<Login />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Senha")).toBeInTheDocument();
  });

  test("executa login de aluno com matrícula no submit", () => {
    mockType = "aluno";

    render(<Login />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "12345" } });

    const button = screen.getByRole("button", { name: "Entrar" });
    fireEvent.click(button);

    expect(consoleSpy).toHaveBeenCalledWith("Login aluno:", "12345");
  });

  test("executa login de professor com email e senha", () => {
    mockType = "professor";

    render(<Login />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "prof@teste.com" } });

    const passwordInput = screen.getByLabelText("Senha");
    fireEvent.change(passwordInput, { target: { value: "1234" } });

    const button = screen.getByRole("button", { name: "Entrar" });
    fireEvent.click(button);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Login prof/coord:",
      "prof@teste.com",
      "1234"
    );
  });

  test("renderiza email e senha quando type=coordenador", () => {
    mockType = "coordenador";

    render(<Login />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Senha")).toBeInTheDocument();
  });

  test("executa login de coordenador com email e senha", () => {
    mockType = "coordenador";

    render(<Login />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "coord@teste.com" } });

    const passwordInput = screen.getByLabelText("Senha");
    fireEvent.change(passwordInput, { target: { value: "1234" } });

    const button = screen.getByRole("button", { name: "Entrar" });
    fireEvent.click(button);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Login prof/coord:",
      "coord@teste.com",
      "1234"
    );
  });
});
