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

import EditarUsuarioPage from "@/app/usuarios/[id]/page";

describe("Pagina editar usuario", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(EditarUsuarioPage, /Editar Usuario/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(EditarUsuarioPage, /Editar Usuario/i);

    cambiar(view.container, "primer_nombre", "Dario Editado");
    enviar(view.container);

    await waitFor(() => expect(api.usuariosApi.update).toHaveBeenCalled());
  });

  test("muestra error al guardar", async () => {
    const api = require("@/lib/api");
    api.usuariosApi.update.mockRejectedValueOnce(new Error("Error editar usuario"));

    const view = await renderPagina(EditarUsuarioPage, /Editar Usuario/i);
    cambiar(view.container, "primer_nombre", "Luis");
    enviar(view.container);

    await waitFor(() => expect(screen.getByText("Error editar usuario")).toBeInTheDocument());
  });

  test("muestra estado no encontrado", async () => {
    const api = require("@/lib/api");

    api.usuariosApi.getById.mockResolvedValueOnce(null);
    render(React.createElement(EditarUsuarioPage));

    await waitFor(() => expect(screen.getByText(/Usuario no encontrado/i)).toBeInTheDocument());
    cleanup();
  });
});
