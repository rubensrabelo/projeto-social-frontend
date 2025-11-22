import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Home from "../../../pages/Home/Home";

let mockType: string | null = "professor";

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
    mockNavigate.mockClear();
  });

  test("exibe mensagem de erro quando o type é inválido", () => {
    mockType = null;

    render(<Home />);

    expect(screen.getByText("Tipo de usuário inválido.")).toBeInTheDocument();
  });

  test("renderiza opções corretas quando type = professor", () => {
    mockType = "professor";

    render(<Home />);

    expect(screen.getByText("Bem-vindo Professor!")).toBeInTheDocument();

    expect(screen.getByText("Minhas Questões")).toBeInTheDocument();
    expect(screen.getByText("Minhas Provas")).toBeInTheDocument();
    expect(screen.getByText("Relatórios")).toBeInTheDocument();
  });

  test("navega para /questions ao clicar em 'Minhas Questões'", () => {
    mockType = "professor";

    render(<Home />);

    fireEvent.click(screen.getByText("Minhas Questões"));

    expect(mockNavigate).toHaveBeenCalledWith("/questions");
  });

  test("navega para /tests ao clicar em 'Minhas Provas'", () => {
    mockType = "professor";

    render(<Home />);

    fireEvent.click(screen.getByText("Minhas Provas"));

    expect(mockNavigate).toHaveBeenCalledWith("/tests");
  });

  test("navega para /reports ao clicar em 'Relatórios'", () => {
    mockType = "professor";

    render(<Home />);

    fireEvent.click(screen.getByText("Relatórios"));

    expect(mockNavigate).toHaveBeenCalledWith("/reports");
  });

  // ───────────────────────────────────────────────
  test("renderiza opções corretas quando type = coordenador", () => {
    mockType = "coordenador";

    render(<Home />);

    expect(screen.getByText("Bem-vindo Coordenador!")).toBeInTheDocument();

    expect(screen.getByText("Gerenciar Turmas")).toBeInTheDocument();
    expect(screen.getByText("Relatórios")).toBeInTheDocument();

    expect(screen.queryByText("Minhas Questões")).toBeNull();
    expect(screen.queryByText("Minhas Provas")).toBeNull();
  });

  // ───────────────────────────────────────────────
  test("navega para /classes ao clicar em 'Gerenciar Turmas'", () => {
    mockType = "coordenador";

    render(<Home />);

    fireEvent.click(screen.getByText("Gerenciar Turmas"));

    expect(mockNavigate).toHaveBeenCalledWith("/classes");
  });

  test("coordenador também navega para /reports ao clicar em 'Relatórios'", () => {
    mockType = "coordenador";

    render(<Home />);

    fireEvent.click(screen.getByText("Relatórios"));

    expect(mockNavigate).toHaveBeenCalledWith("/reports");
  });

  test("não renderiza cards de professor quando type = coordenador", () => {
    mockType = "coordenador";

    render(<Home />);

    expect(screen.queryByText("Minhas Questões")).toBeNull();
    expect(screen.queryByText("Minhas Provas")).toBeNull();
  });
});
