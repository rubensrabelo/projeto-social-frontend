import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../../../pages/Landing/Landing";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, any>;
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("LandingPage", () => {
  it("renderiza a logo", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByAltText("Logo da EP")).toBeInTheDocument();
  });

  it("renderiza os 3 cards", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Aluno")).toBeInTheDocument();
    expect(screen.getByText("Professor")).toBeInTheDocument();
    expect(screen.getByText("Coordenador")).toBeInTheDocument();
  });

  it("navega ao clicar no card Aluno", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Aluno"));

    expect(mockedNavigate).toHaveBeenCalledWith("/login?type=aluno");
  });

  it("navega ao clicar no card Professor", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Professor"));

    expect(mockedNavigate).toHaveBeenCalledWith("/login?type=professor");
  });

  it("navega ao clicar no card Coordenador", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Coordenador"));

    expect(mockedNavigate).toHaveBeenCalledWith("/login?type=coordenador");
  });
});
