import { render, screen } from "@testing-library/react";
import LandingPage from "../../../pages/Landing/Landing";

describe("LandingPage", () => {
  test("renderiza a logo", () => {
    render(<LandingPage />);

    const logo = screen.getByAltText("Logo da EP");
    expect(logo).toBeInTheDocument();
  });

  test("renderiza os 3 cards", () => {
    render(<LandingPage />);

    expect(screen.getByText("Aluno")).toBeInTheDocument();
    expect(screen.getByText("Professor")).toBeInTheDocument();
    expect(screen.getByText("Coordenador")).toBeInTheDocument();
  });
});
