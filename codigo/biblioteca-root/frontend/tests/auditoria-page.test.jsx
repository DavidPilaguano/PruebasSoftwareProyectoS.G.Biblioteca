import {
  cleanup,
  renderPagina,
  screen,
  waitFor,
} from "./support/app-test-utils";

import AuditoriaPage from "@/app/auditoria/page";

describe("Pagina auditoria", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(AuditoriaPage, /Auditor/i);
  });

  test("muestra acciones alternas", async () => {
    const api = require("@/lib/api");

    api.auditoriaApi.getAll.mockResolvedValueOnce([
      {
        id_auditoria: 2,
        tabla_afectada: "usuario",
        id_registro: 2,
        accion: "UPDATE",
        usuario_sistema: "admin",
        fecha_evento: "2026-06-21",
        valor_nuevo: "",
      },
      {
        id_auditoria: 3,
        tabla_afectada: "rol",
        id_registro: 3,
        accion: "DELETE",
        usuario_sistema: "admin",
        fecha_evento: "2026-06-22",
        valor_nuevo: "",
      },
    ]);

    await renderPagina(AuditoriaPage, /Auditor/i);

    await waitFor(() => expect(screen.getByText("UPDATE")).toBeInTheDocument());
    expect(screen.getByText("DELETE")).toBeInTheDocument();
  });

  test("muestra estado vacio", async () => {
    const api = require("@/lib/api");

    api.auditoriaApi.getAll.mockResolvedValueOnce([]);
    await renderPagina(AuditoriaPage, /Auditor/i);

    await waitFor(() => expect(screen.getByText(/No hay registros/i)).toBeInTheDocument());
  });

  test("muestra error de carga", async () => {
    const api = require("@/lib/api");

    api.auditoriaApi.getAll.mockRejectedValueOnce(new Error("Error auditoria"));
    await renderPagina(AuditoriaPage, /Auditor/i);

    await waitFor(() => expect(screen.getByText("Error auditoria")).toBeInTheDocument());
    cleanup();
  });
});
