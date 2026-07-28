import {
  cambiar,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import CrearPrestamoPage from "@/app/prestamos/crear/page";

describe("Pagina crear prestamo", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(CrearPrestamoPage, /Crear Pr/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearPrestamoPage, /Crear Pr/i);

    cambiar(view.container, "id_usuario", "1");
    cambiar(view.container, "id_usuario_sistema", "1");
    cambiar(view.container, "id_ejemplar", "1");
    enviar(view.container);

    await waitFor(() => expect(api.prestamosApi.create).toHaveBeenCalled());
  });

  test("muestra validacion de campos requeridos", async () => {
    const view = await renderPagina(CrearPrestamoPage, /Crear Pr/i);

    enviar(view.container);

    expect(screen.getByText(/Por favor completa/i)).toBeInTheDocument();
  });

  test("envia fecha de devolucion esperada personalizada", async () => {
    const api = require("@/lib/api");

    await renderPagina(CrearPrestamoPage, /Crear Pr/i);
    cambiar(document.body, "id_usuario", "1");
    cambiar(document.body, "id_usuario_sistema", "1");
    cambiar(document.body, "id_ejemplar", "1");
    cambiar(document.body, "fecha_devolucion_esperada", "2026-07-15");
    enviar(document.body);

    await waitFor(() =>
      expect(api.prestamosApi.create).toHaveBeenCalledWith(
        expect.objectContaining({ fecha_devolucion_esperada: "2026-07-15" }),
      ),
    );
  });

  test("muestra error al cargar datos", async () => {
    const api = require("@/lib/api");

    api.usuariosApi.getAll.mockRejectedValueOnce(new Error("Error cargando datos"));
    await renderPagina(CrearPrestamoPage, /Crear Pr/i);

    await waitFor(() =>
      expect(screen.getByText("Error cargando datos")).toBeInTheDocument(),
    );
  });

  test("muestra error al crear prestamo", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearPrestamoPage, /Crear Pr/i);

    api.prestamosApi.create.mockRejectedValueOnce(new Error("Error creando prestamo"));
    cambiar(view.container, "id_usuario", "1");
    cambiar(view.container, "id_usuario_sistema", "1");
    cambiar(view.container, "id_ejemplar", "1");
    enviar(view.container);

    await waitFor(() =>
      expect(screen.getByText("Error creando prestamo")).toBeInTheDocument(),
    );
  });
});
