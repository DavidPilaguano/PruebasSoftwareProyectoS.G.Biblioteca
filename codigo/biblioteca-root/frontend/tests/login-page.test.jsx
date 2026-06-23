import {
  fireEvent,
  mockLogin,
  renderPagina,
  screen,
  waitFor,
  enviar,
} from "./support/app-test-utils";

import LoginPage from "@/app/login/page";

describe("Pagina login", () => {
  test("renderiza la pagina", async () => {
    await renderPagina(LoginPage, /Biblioteca ESPE/i);
  });

  test("envia credenciales correctamente", async () => {
    const view = await renderPagina(LoginPage, /Biblioteca ESPE/i);
    const loginInputs = view.container.querySelectorAll("input");

    fireEvent.change(loginInputs[0], { target: { value: "dpilaguano" } });
    fireEvent.change(loginInputs[1], { target: { value: "hash_admin" } });
    enviar(view.container);

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("dpilaguano", "hash_admin"));
  });

  test("muestra error cuando las credenciales son invalidas", async () => {
    const view = await renderPagina(LoginPage, /Biblioteca ESPE/i);
    mockLogin.mockRejectedValueOnce(new Error("Credenciales invalidas"));
    const loginInputs = view.container.querySelectorAll("input");

    fireEvent.change(loginInputs[0], { target: { value: "dpilaguano" } });
    fireEvent.change(loginInputs[1], { target: { value: "incorrecta" } });
    enviar(view.container);

    await waitFor(() =>
      expect(screen.getByText(/Usuario o contrase/i)).toBeInTheDocument(),
    );
  });
});
