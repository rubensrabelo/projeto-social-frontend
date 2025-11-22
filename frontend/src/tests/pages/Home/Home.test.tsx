import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Home from "../../../pages/Home/Home";

let mockType: string | null = "professor";

const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

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
  };
});

vi.mock("../../Components/CardOption/CardOption", () => ({
  __esModule: true,
  default: ({ title, onClick }: any) => (
    <button onClick={onClick}>{title}</button>
  ),
}));

describe("Home Page", () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  test("exibe mensagem de erro se o type for inválido", () => {
    mockType = null;

    render(<Home />);

    expect(screen.getByText("Tipo de usuário inválido.")).toBeInTheDocument();
  });

  test("renderiza opções corretas quando type=professor", () => {
    mockType = "professor";

    render(<Home />);

    expect(screen.getByText("Bem-vindo Professor!")).toBeInTheDocument();

    // Professor vê 3 cards
    expect(screen.getByText("Minhas Questões")).toBeInTheDocument();
    expect(screen.getByText("Minhas Provas")).toBeInTheDocument();
    expect(screen.getByText("Relatórios")).toBeInTheDocument();
  });

  test("clicar em 'Minhas Questões' dispara o console esperado", () => {
    mockType = "professor";

    render(<Home />);

    const btn = screen.getByText("Minhas Questões");
    fireEvent.click(btn);

    expect(consoleSpy).toHaveBeenCalledWith("Questões");
  });

  test("clicar em 'Relatórios' dispara o console esperado", () => {
    mockType = "professor";

    render(<Home />);

    const btn = screen.getByText("Relatórios");
    fireEvent.click(btn);

    expect(consoleSpy).toHaveBeenCalledWith("Relatórios");
  });

  test("renderiza opções corretas quando type=coordenador", () => {
    mockType = "coordenador";

    render(<Home />);

    expect(screen.getByText("Bem-vindo Coordenador!")).toBeInTheDocument();

    // Coordenador vê apenas 2 cards
    expect(screen.getByText("Gerenciar Turmas")).toBeInTheDocument();
    expect(screen.getByText("Relatórios")).toBeInTheDocument();

    expect(screen.queryByText("Minhas Questões")).toBeNull();
    expect(screen.queryByText("Minhas Provas")).toBeNull();
  });

  test("clicar em 'Gerenciar Turmas' dispara o console esperado", () => {
    mockType = "coordenador";

    render(<Home />);

    const btn = screen.getByText("Gerenciar Turmas");
    fireEvent.click(btn);

    expect(consoleSpy).toHaveBeenCalledWith("Gerenciar Turmas");
  });

  test("não permite card de professor quando type=coordenador", () => {
    mockType = "coordenador";

    render(<Home />);

    expect(screen.queryByText("Minhas Questões")).toBeNull();
    expect(screen.queryByText("Minhas Provas")).toBeNull();
  });
});
