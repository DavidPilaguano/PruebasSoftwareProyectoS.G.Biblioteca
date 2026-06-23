import {
  cambiar,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import CrearAutorPage from "@/app/libros/autores/crear/page";

describe("Pagina crear autor", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(CrearAutorPage, /Crear Autor/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearAutorPage, /Crear Autor/i);

    cambiar(view.container, "primer_nombre", "Gabriel");
    cambiar(view.container, "primer_apellido", "Garcia");
    enviar(view.container);

    await waitFor(() => expect(api.autoresApi.create).toHaveBeenCalled());
  });

  test("muestra validacion de campos requeridos", async () => {
    const view = await renderPagina(CrearAutorPage, /Crear Autor/i);

    enviar(view.container);

    expect(screen.getByText(/Por favor completa/i)).toBeInTheDocument();
  });

  test("muestra error al guardar", async () => {
    const api = require("@/lib/api");
    api.autoresApi.create.mockRejectedValueOnce(new Error("Error autor"));

    const view = await renderPagina(CrearAutorPage, /Crear Autor/i);
    cambiar(view.container, "primer_nombre", "Gabriel");
    cambiar(view.container, "primer_apellido", "Garcia");
    enviar(view.container);

    await waitFor(() => expect(screen.getByText("Error autor")).toBeInTheDocument());
  });
});
