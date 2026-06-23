import {
  cleanup,
  fireEvent,
  prestamo,
  renderPagina,
  screen,
  waitFor,
} from "./support/app-test-utils";

import PrestamosPage from "@/app/prestamos/page";

describe("Pagina prestamos", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(PrestamosPage, /Pr/i);
  });

  test("cancela un prestamo", async () => {
    const api = require("@/lib/api");
    global.confirm = jest.fn(() => true);

    await renderPagina(PrestamosPage, /Pr/i);

    await waitFor(() => expect(screen.getByText("ACTIVO")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Cancelar"));
    await waitFor(() => expect(api.prestamosApi.delete).toHaveBeenCalledWith(1));
  });

  test("muestra estados alternos", async () => {
    const api = require("@/lib/api");

    api.prestamosApi.getAll.mockResolvedValueOnce([
      {
        ...prestamo,
        id_prestamo: 2,
        estado: "DEVUELTO",
        fecha_devolucion_esperada: "",
      },
      { ...prestamo, id_prestamo: 3, estado: "ATRASADO" },
    ]);

    await renderPagina(PrestamosPage, /Pr/i);

    await waitFor(() => expect(screen.getByText("DEVUELTO")).toBeInTheDocument());
    expect(screen.getByText("ATRASADO")).toBeInTheDocument();
  });

  test("muestra estado vacio", async () => {
    const api = require("@/lib/api");

    api.prestamosApi.getAll.mockResolvedValueOnce([]);
    await renderPagina(PrestamosPage, /Pr/i);

    await waitFor(() => expect(screen.getByText(/No hay pr/i)).toBeInTheDocument());
  });

  test("muestra error de carga", async () => {
    const api = require("@/lib/api");

    api.prestamosApi.getAll.mockRejectedValueOnce(new Error("Error prestamos"));
    await renderPagina(PrestamosPage, /Pr/i);

    await waitFor(() => expect(screen.getByText("Error prestamos")).toBeInTheDocument());
  });

  test("cubre cancelacion y error al cancelar", async () => {
    const api = require("@/lib/api");
    global.alert = jest.fn();

    global.confirm = jest.fn(() => false);
    await renderPagina(PrestamosPage, /Pr/i);
    await waitFor(() => expect(screen.getByText("Cancelar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Cancelar"));
    expect(api.prestamosApi.delete).not.toHaveBeenCalled();
    cleanup();

    global.confirm = jest.fn(() => true);
    api.prestamosApi.delete.mockRejectedValueOnce(new Error("Error cancelando prestamo"));
    await renderPagina(PrestamosPage, /Pr/i);
    await waitFor(() => expect(screen.getByText("Cancelar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Cancelar"));
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Error cancelando prestamo"));
  });
});
