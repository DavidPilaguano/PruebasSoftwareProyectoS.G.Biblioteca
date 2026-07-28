import {
  cambiar,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import CrearUsuarioPage from "@/app/usuarios/crear/page";

describe("Pagina crear usuario", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(CrearUsuarioPage, /Crear Usuario/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearUsuarioPage, /Crear Usuario/i);

    cambiar(view.container, "codigo_institucional", "EST2026001");
    cambiar(view.container, "primer_nombre", "Luis");
    cambiar(view.container, "primer_apellido", "Castillo");
    cambiar(view.container, "correo", "lcastillo@espe.edu.ec");
    cambiar(view.container, "id_rol", "1");
    enviar(view.container);

    await waitFor(() => expect(api.usuariosApi.create).toHaveBeenCalled());
  });

  test("muestra validacion de campos requeridos", async () => {
    const view = await renderPagina(CrearUsuarioPage, /Crear Usuario/i);

    enviar(view.container);

    expect(screen.getByText(/Por favor completa/i)).toBeInTheDocument();
  });

  test("muestra error al cargar roles", async () => {
    const api = require("@/lib/api");

    api.rolesApi.getAll.mockRejectedValueOnce(new Error("Error cargando roles"));
    await renderPagina(CrearUsuarioPage, /Crear Usuario/i);

    await waitFor(() =>
      expect(screen.getByText("Error cargando roles")).toBeInTheDocument(),
    );
  });

  test("muestra error al crear usuario", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearUsuarioPage, /Crear Usuario/i);

    api.usuariosApi.create.mockRejectedValueOnce(new Error("Error creando usuario"));
    cambiar(view.container, "codigo_institucional", "EST2026001");
    cambiar(view.container, "primer_nombre", "Luis");
    cambiar(view.container, "primer_apellido", "Castillo");
    cambiar(view.container, "correo", "lcastillo@espe.edu.ec");
    cambiar(view.container, "id_rol", "1");
    enviar(view.container);

    await waitFor(() =>
      expect(screen.getByText("Error creando usuario")).toBeInTheDocument(),
    );
  });
});
