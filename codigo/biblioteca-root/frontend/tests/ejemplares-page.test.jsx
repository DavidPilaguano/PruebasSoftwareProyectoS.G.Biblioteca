import {
  cleanup,
  ejemplar,
  fireEvent,
  renderPagina,
  screen,
  waitFor,
} from "./support/app-test-utils";

import EjemplaresPage from "@/app/ejemplares/page";

describe("Pagina ejemplares", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(EjemplaresPage, /Ejemplares/i);
  });

  test("elimina un ejemplar", async () => {
    const api = require("@/lib/api");
    global.confirm = jest.fn(() => true);

    await renderPagina(EjemplaresPage, /Ejemplares/i);

    await waitFor(() => expect(screen.getByText("BC-001")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    await waitFor(() => expect(api.ejemplaresApi.delete).toHaveBeenCalledWith(1));
  });

  test("muestra estados alternos", async () => {
    const api = require("@/lib/api");

    api.ejemplaresApi.getAll.mockResolvedValueOnce([
      { ...ejemplar, id_ejemplar: 2, codigo_barra: "BC-002", estado: "PRESTADO" },
      { ...ejemplar, id_ejemplar: 3, codigo_barra: "BC-003", estado: "PERDIDO" },
    ]);

    await renderPagina(EjemplaresPage, /Ejemplares/i);

    await waitFor(() => expect(screen.getByText("PRESTADO")).toBeInTheDocument());
    expect(screen.getByText("PERDIDO")).toBeInTheDocument();
  });

  test("muestra estado vacio", async () => {
    const api = require("@/lib/api");

    api.ejemplaresApi.getAll.mockResolvedValueOnce([]);
    await renderPagina(EjemplaresPage, /Ejemplares/i);

    await waitFor(() => expect(screen.getByText(/No hay ejemplares/i)).toBeInTheDocument());
  });

  test("muestra error de carga", async () => {
    const api = require("@/lib/api");

    api.ejemplaresApi.getAll.mockRejectedValueOnce(new Error("Error ejemplares"));
    await renderPagina(EjemplaresPage, /Ejemplares/i);

    await waitFor(() => expect(screen.getByText("Error ejemplares")).toBeInTheDocument());
  });

  test("cubre cancelacion y error al eliminar", async () => {
    const api = require("@/lib/api");
    global.alert = jest.fn();

    global.confirm = jest.fn(() => false);
    await renderPagina(EjemplaresPage, /Ejemplares/i);
    await waitFor(() => expect(screen.getByText("Eliminar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    expect(api.ejemplaresApi.delete).not.toHaveBeenCalled();
    cleanup();

    global.confirm = jest.fn(() => true);
    api.ejemplaresApi.delete.mockRejectedValueOnce(new Error("Error eliminando ejemplar"));
    await renderPagina(EjemplaresPage, /Ejemplares/i);
    await waitFor(() => expect(screen.getByText("Eliminar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Error eliminando ejemplar"));
  });
});
