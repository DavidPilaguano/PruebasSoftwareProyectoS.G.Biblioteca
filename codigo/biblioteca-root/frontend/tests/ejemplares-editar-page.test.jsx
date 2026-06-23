import {
  React,
  cambiar,
  cleanup,
  ejemplar,
  render,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import EditarEjemplarPage from "@/app/ejemplares/[id]/page";

describe("Pagina editar ejemplar", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(EditarEjemplarPage, /Editar Ejemplar/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(EditarEjemplarPage, /Editar Ejemplar/i);

    cambiar(view.container, "estado", "PRESTADO");
    enviar(view.container);

    await waitFor(() => expect(api.ejemplaresApi.update).toHaveBeenCalled());
  });

  test("muestra error al guardar", async () => {
    const api = require("@/lib/api");
    api.ejemplaresApi.update.mockRejectedValueOnce(new Error("Error editar ejemplar"));

    const view = await renderPagina(EditarEjemplarPage, /Editar Ejemplar/i);
    cambiar(view.container, "estado", "PERDIDO");
    enviar(view.container);

    await waitFor(() => expect(screen.getByText("Error editar ejemplar")).toBeInTheDocument());
  });

  test("muestra estado no encontrado", async () => {
    const api = require("@/lib/api");

    api.ejemplaresApi.getById.mockResolvedValueOnce(null);
    render(React.createElement(EditarEjemplarPage));

    await waitFor(() => expect(screen.getByText(/Ejemplar no encontrado/i)).toBeInTheDocument());
    cleanup();
  });

  test("muestra valores opcionales vacios", async () => {
    const api = require("@/lib/api");

    api.ejemplaresApi.getById.mockResolvedValueOnce({
      ...ejemplar,
      codigo_barra: "",
      ubicacion_fisica: undefined,
      libro: undefined,
    });

    await renderPagina(EditarEjemplarPage, /Editar Ejemplar/i);

    expect(screen.getByDisplayValue("No disponible")).toBeInTheDocument();
  });
});
