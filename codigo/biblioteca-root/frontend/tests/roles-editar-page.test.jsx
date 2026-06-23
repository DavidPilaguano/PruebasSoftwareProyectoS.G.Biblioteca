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

import EditarRolPage from "@/app/roles/[id]/page";

describe("Pagina editar rol", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(EditarRolPage, /Editar Rol/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(EditarRolPage, /Editar Rol/i);

    cambiar(view.container, "nombre", "DOCENTE");
    enviar(view.container);

    await waitFor(() => expect(api.rolesApi.update).toHaveBeenCalled());
  });

  test("muestra error al guardar", async () => {
    const api = require("@/lib/api");
    api.rolesApi.update.mockRejectedValueOnce(new Error("Error editar rol"));

    const view = await renderPagina(EditarRolPage, /Editar Rol/i);
    cambiar(view.container, "nombre", "DOCENTE");
    enviar(view.container);

    await waitFor(() => expect(screen.getByText("Error editar rol")).toBeInTheDocument());
  });

  test("muestra estado no encontrado", async () => {
    const api = require("@/lib/api");

    api.rolesApi.getById.mockResolvedValueOnce(null);
    render(React.createElement(EditarRolPage));

    await waitFor(() => expect(screen.getByText(/Rol no encontrado/i)).toBeInTheDocument());
    cleanup();
  });
});
