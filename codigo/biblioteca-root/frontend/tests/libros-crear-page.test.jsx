import {
  cambiar,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import CrearLibroPage from "@/app/libros/crear/page";

describe("Pagina crear libro", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(CrearLibroPage, /Crear Libro/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearLibroPage, /Crear Libro/i);

    cambiar(view.container, "titulo", "Libro Nuevo");
    cambiar(view.container, "isbn", "978-0000000002");
    cambiar(view.container, "id_categoria", "1");
    cambiar(view.container, "id_editorial", "1");
    cambiar(view.container, "descripcion", "Laboratorio de Programacion Avanzada");
    enviar(view.container);

    await waitFor(() => expect(api.librosApi.create).toHaveBeenCalled());
  });

  test("muestra validacion de campos requeridos", async () => {
    const view = await renderPagina(CrearLibroPage, /Crear Libro/i);

    enviar(view.container);

    expect(screen.getByText(/Por favor completa/i)).toBeInTheDocument();
  });
});
