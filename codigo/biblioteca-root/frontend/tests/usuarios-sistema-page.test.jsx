import {
  cleanup,
  fireEvent,
  renderPagina,
  screen,
  usuarioSistema,
  waitFor,
} from "./support/app-test-utils";

import UsuariosSistemaPage from "@/app/usuarios-sistema/page";

describe("Pagina usuarios del sistema", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(UsuariosSistemaPage, /Usuarios del Sistema/i);
  });

  test("elimina un usuario del sistema", async () => {
    const api = require("@/lib/api");
    global.confirm = jest.fn(() => true);

    await renderPagina(UsuariosSistemaPage, /Usuarios del Sistema/i);

    await waitFor(() => expect(screen.getByText("dpilaguano")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    await waitFor(() => expect(api.usuariosSistemaApi.delete).toHaveBeenCalledWith(1));
  });

  test("muestra estado alterno", async () => {
    const api = require("@/lib/api");

    api.usuariosSistemaApi.getAll.mockResolvedValueOnce([
      { ...usuarioSistema, id_usuario_sistema: 2, estado: "INACTIVO" },
    ]);

    await renderPagina(UsuariosSistemaPage, /Usuarios del Sistema/i);

    await waitFor(() => expect(screen.getByText("INACTIVO")).toBeInTheDocument());
  });

  test("muestra estado vacio", async () => {
    const api = require("@/lib/api");

    api.usuariosSistemaApi.getAll.mockResolvedValueOnce([]);
    await renderPagina(UsuariosSistemaPage, /Usuarios del Sistema/i);

    await waitFor(() =>
      expect(screen.getByText(/No hay usuarios del sistema/i)).toBeInTheDocument(),
    );
  });

  test("muestra error de carga", async () => {
    const api = require("@/lib/api");

    api.usuariosSistemaApi.getAll.mockRejectedValueOnce(
      new Error("Error usuarios sistema"),
    );
    await renderPagina(UsuariosSistemaPage, /Usuarios del Sistema/i);

    await waitFor(() =>
      expect(screen.getByText("Error usuarios sistema")).toBeInTheDocument(),
    );
  });

  test("cubre cancelacion y error al eliminar", async () => {
    const api = require("@/lib/api");
    global.alert = jest.fn();

    global.confirm = jest.fn(() => false);
    await renderPagina(UsuariosSistemaPage, /Usuarios del Sistema/i);
    await waitFor(() => expect(screen.getByText("Eliminar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    expect(api.usuariosSistemaApi.delete).not.toHaveBeenCalled();
    cleanup();

    global.confirm = jest.fn(() => true);
    api.usuariosSistemaApi.delete.mockRejectedValueOnce(
      new Error("Error eliminando usuario"),
    );
    await renderPagina(UsuariosSistemaPage, /Usuarios del Sistema/i);
    await waitFor(() => expect(screen.getByText("Eliminar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Error eliminando usuario"));
  });
});
