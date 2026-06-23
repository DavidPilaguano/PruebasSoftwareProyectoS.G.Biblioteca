import {
  React,
  cambiar,
  cleanup,
  input,
  render,
  renderPagina,
  screen,
  usuarioSistema,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import EditarUsuarioSistemaPage from "@/app/usuarios-sistema/[id]/page";

describe("Pagina editar usuario del sistema", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(EditarUsuarioSistemaPage, /Editar Usuario del Sistema/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(EditarUsuarioSistemaPage, /Editar Usuario del Sistema/i);

    cambiar(view.container, "primer_nombre", "David Editado");
    enviar(view.container);

    await waitFor(() => expect(api.usuariosSistemaApi.update).toHaveBeenCalled());
  });

  test("muestra error al guardar", async () => {
    const api = require("@/lib/api");
    api.usuariosSistemaApi.update.mockRejectedValueOnce(
      new Error("Error editar usuario sistema"),
    );

    const view = await renderPagina(EditarUsuarioSistemaPage, /Editar Usuario del Sistema/i);
    cambiar(view.container, "primer_nombre", "Ana");
    enviar(view.container);

    await waitFor(() =>
      expect(screen.getByText("Error editar usuario sistema")).toBeInTheDocument(),
    );
  });

  test("muestra estado no encontrado", async () => {
    const api = require("@/lib/api");

    api.usuariosSistemaApi.getById.mockResolvedValueOnce(null);
    render(React.createElement(EditarUsuarioSistemaPage));

    await waitFor(() => expect(screen.getByText(/Usuario no encontrado/i)).toBeInTheDocument());
    cleanup();
  });

  test("muestra valores opcionales vacios", async () => {
    const api = require("@/lib/api");

    api.usuariosSistemaApi.getById.mockResolvedValueOnce({
      ...usuarioSistema,
      segundo_nombre: undefined,
      segundo_apellido: undefined,
    });

    await renderPagina(EditarUsuarioSistemaPage, /Editar Usuario del Sistema/i);

    expect(input(document.body, "segundo_nombre").value).toEqual("");
  });
});
