import {
  cambiar,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import CrearRolPage from "@/app/roles/crear/page";

describe("Pagina crear rol", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(CrearRolPage, /Crear Rol/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearRolPage, /Crear Rol/i);

    cambiar(view.container, "nombre", "DOCENTE");
    enviar(view.container);

    await waitFor(() => expect(api.rolesApi.create).toHaveBeenCalled());
  });

  test("muestra validacion de campos requeridos", async () => {
    const view = await renderPagina(CrearRolPage, /Crear Rol/i);

    enviar(view.container);

    expect(screen.getByText(/Por favor completa/i)).toBeInTheDocument();
  });
});
