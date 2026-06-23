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
});
