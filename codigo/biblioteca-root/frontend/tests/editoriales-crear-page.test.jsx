import {
  cambiar,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import CrearEditorialPage from "@/app/libros/editoriales/crear/page";

describe("Pagina crear editorial", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(CrearEditorialPage, /Crear Editorial/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearEditorialPage, /Crear Editorial/i);

    cambiar(view.container, "nombre", "Editorial ESPE");
    cambiar(view.container, "pais", "Ecuador");
    enviar(view.container);

    await waitFor(() => expect(api.editorialesApi.create).toHaveBeenCalled());
  });

  test("muestra validacion de campos requeridos", async () => {
    const view = await renderPagina(CrearEditorialPage, /Crear Editorial/i);

    enviar(view.container);

    expect(screen.getByText(/Por favor completa/i)).toBeInTheDocument();
  });
});
