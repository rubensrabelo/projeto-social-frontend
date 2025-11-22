import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Navbar from "../../../Components/Navbar/Navbar";

describe("Navbar Component", () => {

  test("renders system name and all icons", () => {
    render(<Navbar />);

    expect(screen.getByText("Sistema de Avaliações")).toBeInTheDocument();

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Notifications")).toBeInTheDocument();
    expect(screen.getByAltText("Profile")).toBeInTheDocument();
    expect(screen.getByAltText("Menu")).toBeInTheDocument();
  });

  test("dropdown menu is hidden by default", () => {
    render(<Navbar />);

    expect(screen.queryByText("Meu Perfil")).toBeNull();
    expect(screen.queryByText("Configurações")).toBeNull();
    expect(screen.queryByText("Sair")).toBeNull();
  });

  test("opens dropdown when arrow is clicked", () => {
    render(<Navbar />);

    const arrow = screen.getByAltText("Menu");
    fireEvent.click(arrow);

    expect(screen.getByText("Meu Perfil")).toBeInTheDocument();
    expect(screen.getByText("Configurações")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
  });

  test("closes dropdown when arrow is clicked again", () => {
    render(<Navbar />);

    const arrow = screen.getByAltText("Menu");

    fireEvent.click(arrow); // abre
    fireEvent.click(arrow); // fecha

    expect(screen.queryByText("Meu Perfil")).toBeNull();
    expect(screen.queryByText("Configurações")).toBeNull();
    expect(screen.queryByText("Sair")).toBeNull();
  });

});
