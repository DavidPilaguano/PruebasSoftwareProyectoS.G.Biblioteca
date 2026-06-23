import {
  React,
  cleanup,
  render,
  renderPagina,
  waitFor,
} from "./support/app-test-utils";

import DashboardPage from "@/app/page";

describe("Pagina dashboard", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(DashboardPage, /Dashboard/i);
  });

  test("cubre error al cargar datos del dashboard", async () => {
    const api = require("@/lib/api");
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    api.prestamosApi.getAll.mockRejectedValueOnce(new Error("Dashboard fallido"));
    render(React.createElement(DashboardPage));

    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    cleanup();
    consoleError.mockRestore();
  });
});
