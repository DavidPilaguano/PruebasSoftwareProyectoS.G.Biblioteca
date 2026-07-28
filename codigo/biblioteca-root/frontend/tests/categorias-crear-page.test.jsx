import {
  cambiar,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import CrearCategoriaPage from "@/app/libros/categorias/crear/page";

describe("Pagina crear categoria", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(CrearCategoriaPage, /Crear Categor/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearCategoriaPage, /Crear Categor/i);

    cambiar(view.container, "nombre", "Programacion");
    cambiar(view.container, "descripcion", "Laboratorio de Programacion Avanzada");
    enviar(view.container);

    await waitFor(() => expect(api.categoriasApi.create).toHaveBeenCalled());
  });

  test("muestra validacion de campos requeridos", async () => {
    const view = await renderPagina(CrearCategoriaPage, /Crear Categor/i);

    enviar(view.container);

    expect(screen.getByText(/Por favor completa/i)).toBeInTheDocument();
  });

  test("muestra error al crear categoria", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearCategoriaPage, /Crear Categor/i);

    api.categoriasApi.create.mockRejectedValueOnce(new Error("Error creando categoria"));
    cambiar(view.container, "nombre", "Programacion");
    enviar(view.container);

    await waitFor(() =>
      expect(screen.getByText("Error creando categoria")).toBeInTheDocument(),
    );
  });
});
