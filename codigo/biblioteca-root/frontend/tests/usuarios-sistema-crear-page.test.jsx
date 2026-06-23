import {
  cambiar,
  fireEvent,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import CrearUsuarioSistemaPage from "@/app/usuarios-sistema/crear/page";

describe("Pagina crear usuario del sistema", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(CrearUsuarioSistemaPage, /Crear Usuario del Sistema/i);
  });

  test("envia el formulario correctamente", async () => {
    const api = require("@/lib/api");
    const view = await renderPagina(CrearUsuarioSistemaPage, /Crear Usuario del Sistema/i);

    cambiar(view.container, "username", "bibliotecario");
    cambiar(view.container, "password_hash", "hash_test");
    cambiar(view.container, "primer_nombre", "Ana");
    cambiar(view.container, "primer_apellido", "Lopez");
    enviar(view.container);

    await waitFor(() => expect(api.usuariosSistemaApi.create).toHaveBeenCalled());
  });

  test("muestra validacion de campos requeridos", async () => {
    const view = await renderPagina(CrearUsuarioSistemaPage, /Crear Usuario del Sistema/i);

    enviar(view.container);

    expect(screen.getByText(/Por favor completa/i)).toBeInTheDocument();
  });

  test("valida longitud minima de contrasena", async () => {
    const view = await renderPagina(CrearUsuarioSistemaPage, /Crear Usuario del Sistema/i);

    cambiar(view.container, "username", "bibliotecario");
    cambiar(view.container, "password_hash", "123");
    cambiar(view.container, "primer_nombre", "Ana");
    cambiar(view.container, "primer_apellido", "Lopez");
    enviar(view.container);

    expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument();
  });

  test("muestra error al guardar", async () => {
    const api = require("@/lib/api");
    api.usuariosSistemaApi.create.mockRejectedValueOnce(
      new Error("Error usuario sistema"),
    );

    const view = await renderPagina(CrearUsuarioSistemaPage, /Crear Usuario del Sistema/i);
    cambiar(view.container, "username", "bibliotecario");
    cambiar(view.container, "password_hash", "hash_test");
    cambiar(view.container, "primer_nombre", "Ana");
    cambiar(view.container, "primer_apellido", "Lopez");
    enviar(view.container);

    await waitFor(() =>
      expect(screen.getByText("Error usuario sistema")).toBeInTheDocument(),
    );
  });

  test("cambia la visibilidad de la contrasena", async () => {
    const view = await renderPagina(CrearUsuarioSistemaPage, /Crear Usuario del Sistema/i);
    const passwordInput = view.container.querySelector('[name="password_hash"]');

    expect(passwordInput.type).toEqual("password");
    fireEvent.click(screen.getByText("Mostrar"));

    expect(passwordInput.type).toEqual("text");
    expect(screen.getByText("Ocultar")).toBeInTheDocument();
  });
});
