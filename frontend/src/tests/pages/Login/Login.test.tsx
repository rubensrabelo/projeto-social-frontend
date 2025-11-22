import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Login from "../../../pages/Login/Login";

let mockType: string | null = "aluno";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");

  return {
    ...actual,

    useSearchParams: () => [
      {
        get: (key: string) => {
          if (key === "type") return mockType;
          return null;
        },
      },
    ],

    useNavigate: () => mockNavigate,

    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
  };
});

const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

describe("LoginPage", () => {
  beforeEach(() => {
    consoleSpy.mockClear();
    mockNavigate.mockClear();
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
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("executa login de professor com email e senha", () => {
    mockType = "professor";

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "prof@teste.com" },
    });

    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(consoleSpy).toHaveBeenCalledWith(
      "Login prof/coord:",
      "prof@teste.com",
      "1234"
    );
  });

  test("executa login de coordenador com email e senha", () => {
    mockType = "coordenador";

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "coord@teste.com" },
    });

    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(consoleSpy).toHaveBeenCalledWith(
      "Login prof/coord:",
      "coord@teste.com",
      "1234"
    );
  });

  test('mostra link "Esqueceu sua senha?" quando type=professor', () => {
    mockType = "professor";

    render(<Login />);

    const link = screen.getByText("Esqueceu sua senha?");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/recover-password?type=professor");
  });

  test('mostra link "Esqueceu sua senha?" quando type=coordenador', () => {
    mockType = "coordenador";

    render(<Login />);

    const link = screen.getByText("Esqueceu sua senha?");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/recover-password?type=coordenador");
  });

  test('NÃO mostra link "Esqueceu sua senha?" quando type=aluno', () => {
    mockType = "aluno";

    render(<Login />);

    const link = screen.queryByText("Esqueceu sua senha?");
    expect(link).toBeNull();
  });

  test("navega para home quando professor faz login", () => {
    mockType = "professor";

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "prof@teste.com" },
    });

    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(mockNavigate).toHaveBeenCalledWith("/app/home?type=professor");
  });

  test("navega para home quando coordenador faz login", () => {
    mockType = "coordenador";

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "coord@teste.com" },
    });

    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(mockNavigate).toHaveBeenCalledWith("/app/home?type=coordenador");
  });

  test("aluno NÃO navega", () => {
    mockType = "aluno";

    render(<Login />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "9999" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
