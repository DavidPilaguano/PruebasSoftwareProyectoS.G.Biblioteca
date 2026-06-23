import {
  cleanup,
  fireEvent,
  renderPagina,
  screen,
  usuario,
  waitFor,
} from "./support/app-test-utils";

import UsuariosPage from "@/app/usuarios/page";

describe("Pagina usuarios", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(UsuariosPage, /Usuarios/i);
  });

  test("elimina un usuario", async () => {
    const api = require("@/lib/api");
    global.confirm = jest.fn(() => true);

    await renderPagina(UsuariosPage, /Usuarios/i);

    await waitFor(() => expect(screen.getByText(/Dario/)).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    await waitFor(() => expect(api.usuariosApi.delete).toHaveBeenCalledWith(1));
  });

  test("muestra estado alterno", async () => {
    const api = require("@/lib/api");

    api.usuariosApi.getAll.mockResolvedValueOnce([
      { ...usuario, id_usuario: 2, estado: "SUSPENDIDO" },
    ]);

    await renderPagina(UsuariosPage, /Usuarios/i);

    await waitFor(() => expect(screen.getByText("SUSPENDIDO")).toBeInTheDocument());
  });

  test("muestra estado vacio", async () => {
    const api = require("@/lib/api");

    api.usuariosApi.getAll.mockResolvedValueOnce([]);
    await renderPagina(UsuariosPage, /Usuarios/i);

    await waitFor(() => expect(screen.getByText(/No hay usuarios/i)).toBeInTheDocument());
  });

  test("muestra error de carga", async () => {
    const api = require("@/lib/api");

    api.usuariosApi.getAll.mockRejectedValueOnce(new Error("Error usuarios"));
    await renderPagina(UsuariosPage, /Usuarios/i);

    await waitFor(() => expect(screen.getByText("Error usuarios")).toBeInTheDocument());
  });

  test("cubre cancelacion y error al eliminar", async () => {
    const api = require("@/lib/api");
    global.alert = jest.fn();

    global.confirm = jest.fn(() => false);
    await renderPagina(UsuariosPage, /Usuarios/i);
    await waitFor(() => expect(screen.getByText("Eliminar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    expect(api.usuariosApi.delete).not.toHaveBeenCalled();
    cleanup();

    global.confirm = jest.fn(() => true);
    api.usuariosApi.delete.mockRejectedValueOnce(new Error("Error eliminando usuario"));
    await renderPagina(UsuariosPage, /Usuarios/i);
    await waitFor(() => expect(screen.getByText("Eliminar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Error eliminando usuario"));
  });
});
