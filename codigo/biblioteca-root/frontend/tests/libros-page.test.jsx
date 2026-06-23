import {
  cleanup,
  fireEvent,
  renderPagina,
  screen,
  waitFor,
} from "./support/app-test-utils";

import LibrosPage from "@/app/libros/page";

describe("Pagina libros", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(LibrosPage, /Libros/i);
  });

  test("filtra resultados por busqueda", async () => {
    const view = await renderPagina(LibrosPage, /Libros/i);

    await waitFor(() => expect(screen.getByText("Libro de Pruebas")).toBeInTheDocument());
    fireEvent.change(view.container.querySelector("input"), {
      target: { value: "no existe" },
    });

    expect(screen.getByText(/No se encontraron libros/i)).toBeInTheDocument();
  });

  test("elimina un libro", async () => {
    const api = require("@/lib/api");
    global.confirm = jest.fn(() => true);

    await renderPagina(LibrosPage, /Libros/i);

    await waitFor(() => expect(screen.getByText("Libro de Pruebas")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    await waitFor(() => expect(api.librosApi.delete).toHaveBeenCalledWith(1));
  });

  test("muestra estado vacio", async () => {
    const api = require("@/lib/api");

    api.librosApi.getAll.mockResolvedValueOnce([]);
    await renderPagina(LibrosPage, /Libros/i);

    await waitFor(() => expect(screen.getByText(/No hay libros/i)).toBeInTheDocument());
  });

  test("muestra error de carga", async () => {
    const api = require("@/lib/api");

    api.librosApi.getAll.mockRejectedValueOnce(new Error("Error libros"));
    await renderPagina(LibrosPage, /Libros/i);

    await waitFor(() => expect(screen.getByText("Error libros")).toBeInTheDocument());
  });

  test("cubre cancelacion y error al eliminar", async () => {
    const api = require("@/lib/api");
    global.alert = jest.fn();

    global.confirm = jest.fn(() => false);
    await renderPagina(LibrosPage, /Libros/i);
    await waitFor(() => expect(screen.getByText("Eliminar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    expect(api.librosApi.delete).not.toHaveBeenCalled();
    cleanup();

    global.confirm = jest.fn(() => true);
    api.librosApi.delete.mockRejectedValueOnce(new Error("Error eliminando libro"));
    await renderPagina(LibrosPage, /Libros/i);
    await waitFor(() => expect(screen.getByText("Eliminar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Error eliminando libro"));
  });
});
