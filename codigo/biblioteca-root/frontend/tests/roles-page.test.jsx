import {
  cleanup,
  fireEvent,
  renderPagina,
  screen,
  waitFor,
} from "./support/app-test-utils";

import RolesPage from "@/app/roles/page";

describe("Pagina roles", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(RolesPage, /Roles/i);
  });

  test("elimina un rol", async () => {
    const api = require("@/lib/api");
    global.confirm = jest.fn(() => true);

    await renderPagina(RolesPage, /Roles/i);

    await waitFor(() => expect(screen.getByText("ESTUDIANTE")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    await waitFor(() => expect(api.rolesApi.delete).toHaveBeenCalledWith(1));
  });

  test("muestra estado vacio", async () => {
    const api = require("@/lib/api");

    api.rolesApi.getAll.mockResolvedValueOnce([]);
    await renderPagina(RolesPage, /Roles/i);

    await waitFor(() => expect(screen.getByText(/No hay roles/i)).toBeInTheDocument());
  });

  test("muestra error de carga", async () => {
    const api = require("@/lib/api");

    api.rolesApi.getAll.mockRejectedValueOnce(new Error("Error roles"));
    await renderPagina(RolesPage, /Roles/i);

    await waitFor(() => expect(screen.getByText("Error roles")).toBeInTheDocument());
  });

  test("cubre cancelacion y error al eliminar", async () => {
    const api = require("@/lib/api");
    global.alert = jest.fn();

    global.confirm = jest.fn(() => false);
    await renderPagina(RolesPage, /Roles/i);
    await waitFor(() => expect(screen.getByText("Eliminar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    expect(api.rolesApi.delete).not.toHaveBeenCalled();
    cleanup();

    global.confirm = jest.fn(() => true);
    api.rolesApi.delete.mockRejectedValueOnce(new Error("Error eliminando rol"));
    await renderPagina(RolesPage, /Roles/i);
    await waitFor(() => expect(screen.getByText("Eliminar")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Eliminar"));
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Error eliminando rol"));
  });
});
