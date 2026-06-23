import {
  React,
  cambiar,
  cleanup,
  prestamo,
  render,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import EditarPrestamoPage from "@/app/prestamos/[id]/page";

describe("Pagina editar prestamo", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(EditarPrestamoPage, /Editar Pr/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(EditarPrestamoPage, /Editar Pr/i);

    cambiar(view.container, "estado", "DEVUELTO");
    enviar(view.container);

    await waitFor(() => expect(api.prestamosApi.update).toHaveBeenCalled());
  });

  test("muestra error al guardar", async () => {
    const api = require("@/lib/api");
    api.prestamosApi.update.mockRejectedValueOnce(new Error("Error editar prestamo"));

    const view = await renderPagina(EditarPrestamoPage, /Editar Pr/i);
    cambiar(view.container, "estado", "ATRASADO");
    enviar(view.container);

    await waitFor(() => expect(screen.getByText("Error editar prestamo")).toBeInTheDocument());
  });

  test("muestra estado no encontrado", async () => {
    const api = require("@/lib/api");

    api.prestamosApi.getById.mockResolvedValueOnce(null);
    render(React.createElement(EditarPrestamoPage));

    await waitFor(() => expect(screen.getByText(/Pr.*no encontrado/i)).toBeInTheDocument());
    cleanup();
  });

  test("muestra valores opcionales vacios", async () => {
    const api = require("@/lib/api");

    api.prestamosApi.getById.mockResolvedValueOnce({
      ...prestamo,
      usuario: undefined,
      ejemplar: undefined,
      fecha_devolucion_esperada: "",
      fecha_devolucion_real: "",
    });

    await renderPagina(EditarPrestamoPage, /Editar Pr/i);

    expect(screen.getAllByDisplayValue("No disponible").length).toBeGreaterThan(0);
  });
});
