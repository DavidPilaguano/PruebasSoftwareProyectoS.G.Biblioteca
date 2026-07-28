import {
  cambiar,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import CrearEjemplarPage from "@/app/ejemplares/crear/page";

describe("Pagina crear ejemplar", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(CrearEjemplarPage, /Crear Ejemplar/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearEjemplarPage, /Crear Ejemplar/i);

    cambiar(view.container, "id_libro", "1");
    cambiar(view.container, "codigo_barra", "BC-002");
    cambiar(view.container, "ubicacion_fisica", "Estante B-2");
    enviar(view.container);

    await waitFor(() => expect(api.ejemplaresApi.create).toHaveBeenCalled());
  });

  test("muestra validacion de libro requerido", async () => {
    const view = await renderPagina(CrearEjemplarPage, /Crear Ejemplar/i);

    enviar(view.container);

    expect(screen.getByText("Por favor selecciona un libro")).toBeInTheDocument();
  });

  test("muestra error al cargar libros", async () => {
    const api = require("@/lib/api");

    api.librosApi.getAll.mockRejectedValueOnce(new Error("Error cargando libros"));
    await renderPagina(CrearEjemplarPage, /Crear Ejemplar/i);

    await waitFor(() =>
      expect(screen.getByText("Error cargando libros")).toBeInTheDocument(),
    );
  });

  test("muestra error al crear ejemplar", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearEjemplarPage, /Crear Ejemplar/i);

    api.ejemplaresApi.create.mockRejectedValueOnce(new Error("Error creando ejemplar"));
    cambiar(view.container, "id_libro", "1");
    cambiar(view.container, "codigo_barra", "BC-002");
    enviar(view.container);

    await waitFor(() =>
      expect(screen.getByText("Error creando ejemplar")).toBeInTheDocument(),
    );
  });
});
