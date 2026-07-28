import {
  React,
  cleanup,
  render,
  renderPagina,
  screen,
  waitFor,
} from "./support/app-test-utils";

import DashboardPage from "@/app/page";

describe("Pagina dashboard", () => {
  test("renderiza la pagina", async () => {
    const api = require("@/lib/api");
    api.librosApi.getAll.mockResolvedValueOnce([
      { id_libro: 1, titulo: "Libro A", categoria: { nombre: "Programacion" } },
      { id_libro: 2, titulo: "Libro B" },
    ]);

    await renderPagina(DashboardPage, /Dashboard/i);
    await waitFor(() => expect(screen.getAllByText("100%")).toHaveLength(2));
    expect(screen.getByText("Sin clasificar")).toBeInTheDocument();
  });

  test("cubre error al cargar datos del dashboard", async () => {
    const api = require("@/lib/api");
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    api.prestamosApi.getAll.mockRejectedValueOnce(new Error("Dashboard fallido"));
    render(React.createElement(DashboardPage));

    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    cleanup();
    consoleError.mockRestore();
  });

  test("calcula metricas en cero sin datos de gestion", async () => {
    const api = require("@/lib/api");

    api.prestamosApi.getAll.mockResolvedValueOnce([]);
    api.librosApi.getDashboardStats.mockResolvedValueOnce({
      libros: 0,
      usuarios: 0,
      ejemplares: 0,
    });
    api.ejemplaresApi.getAll.mockResolvedValueOnce([]);
    api.usuariosApi.getAll.mockResolvedValueOnce([]);
    api.librosApi.getAll.mockResolvedValueOnce([]);

    render(React.createElement(DashboardPage));

    await waitFor(() => expect(screen.getByText("0.0")).toBeInTheDocument());
    expect(screen.getAllByText("0%")).toHaveLength(2);
    cleanup();
  });
});
