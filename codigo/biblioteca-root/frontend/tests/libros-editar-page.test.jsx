import {
  React,
  cambiar,
  cleanup,
  render,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import EditarLibroPage from "@/app/libros/[id]/page";

describe("Pagina editar libro", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(EditarLibroPage, /Editar Libro/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(EditarLibroPage, /Editar Libro/i);

    cambiar(view.container, "titulo", "Libro Editado");
    enviar(view.container);

    await waitFor(() => expect(api.librosApi.update).toHaveBeenCalled());
  });

  test("muestra error al guardar", async () => {
    const api = require("@/lib/api");
    api.librosApi.update.mockRejectedValueOnce(new Error("Error editar libro"));

    const view = await renderPagina(EditarLibroPage, /Editar Libro/i);
    cambiar(view.container, "titulo", "Libro Fallido");
    enviar(view.container);

    await waitFor(() => expect(screen.getByText("Error editar libro")).toBeInTheDocument());
  });

  test("muestra estado no encontrado", async () => {
    const api = require("@/lib/api");

    api.librosApi.getById.mockResolvedValueOnce(null);
    render(React.createElement(EditarLibroPage));

    await waitFor(() => expect(screen.getByText(/Libro no encontrado/i)).toBeInTheDocument());
    cleanup();
  });
});
