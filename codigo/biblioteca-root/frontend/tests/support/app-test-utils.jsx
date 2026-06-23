import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

export const rol = {
  id_rol: 1,
  nombre: "ESTUDIANTE",
  max_prestamos: 3,
  dias_prestamo: 7,
};

export const categoria = {
  id_categoria: 1,
  nombre: "Programacion",
  descripcion: "Laboratorio de Programacion Avanzada",
};

export const editorial = {
  id_editorial: 1,
  nombre: "Editorial ESPE",
  pais: "Ecuador",
};

export const libro = {
  id_libro: 1,
  isbn: "978-0000000001",
  titulo: "Libro de Pruebas",
  anio_publicacion: 2026,
  descripcion: "Laboratorio de Programacion Avanzada",
  id_categoria: 1,
  id_editorial: 1,
  categoria,
  editorial,
};

export const usuario = {
  id_usuario: 1,
  cedula: "0504853953",
  codigo_institucional: "L00432332",
  primer_nombre: "Dario",
  segundo_nombre: "Emilio",
  primer_apellido: "Pilaguano",
  segundo_apellido: "Chisaguano",
  correo: "dpilaguano@espe.edu.ec",
  telefono: "0987294293",
  estado: "ACTIVO",
  id_rol: 1,
  rol,
};

export const usuarioSistema = {
  id_usuario_sistema: 1,
  username: "dpilaguano",
  primer_nombre: "David",
  segundo_nombre: "",
  primer_apellido: "Pilaguano",
  segundo_apellido: "",
  estado: "ACTIVO",
  rol_sistema: "ADMINISTRADOR",
};

export const ejemplar = {
  id_ejemplar: 1,
  codigo_barra: "BC-001",
  id_libro: 1,
  estado: "DISPONIBLE",
  ubicacion_fisica: "Estante A-1",
  fecha_adquisicion: "2026-06-01",
  libro,
};

export const prestamo = {
  id_prestamo: 1,
  id_usuario: 1,
  id_usuario_sistema: 1,
  id_ejemplar: 1,
  fecha_prestamo: "2026-06-20",
  fecha_devolucion_esperada: "2026-07-04",
  fecha_devolucion_real: "",
  estado: "ACTIVO",
  usuario,
  usuario_sistema: usuarioSistema,
  ejemplar,
};

export const mockPush = jest.fn();
export const mockLogin = jest.fn(() => Promise.resolve());

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  useParams: () => ({ id: "1" }),
  usePathname: () => "/",
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: usuarioSistema,
    loading: false,
    login: mockLogin,
    logout: jest.fn(),
  }),
}));

jest.mock("@/lib/api", () => ({
  librosApi: {
    getAll: jest.fn(() => Promise.resolve([libro])),
    getDashboardStats: jest.fn(() =>
      Promise.resolve({ libros: 1, usuarios: 1, ejemplares: 1 }),
    ),
    getById: jest.fn(() => Promise.resolve(libro)),
    create: jest.fn(() => Promise.resolve(libro)),
    update: jest.fn(() => Promise.resolve(libro)),
    delete: jest.fn(() => Promise.resolve({})),
  },
  categoriasApi: {
    getAll: jest.fn(() => Promise.resolve([categoria])),
    create: jest.fn(() => Promise.resolve(categoria)),
  },
  editorialesApi: {
    getAll: jest.fn(() => Promise.resolve([editorial])),
    create: jest.fn(() => Promise.resolve(editorial)),
  },
  autoresApi: {
    create: jest.fn(() => Promise.resolve({ id_autor: 1 })),
  },
  ejemplaresApi: {
    getAll: jest.fn(() => Promise.resolve([ejemplar])),
    getById: jest.fn(() => Promise.resolve(ejemplar)),
    create: jest.fn(() => Promise.resolve(ejemplar)),
    update: jest.fn(() => Promise.resolve(ejemplar)),
    delete: jest.fn(() => Promise.resolve({})),
  },
  usuariosApi: {
    getAll: jest.fn(() => Promise.resolve([usuario])),
    getById: jest.fn(() => Promise.resolve(usuario)),
    create: jest.fn(() => Promise.resolve(usuario)),
    update: jest.fn(() => Promise.resolve(usuario)),
    delete: jest.fn(() => Promise.resolve({})),
  },
  usuariosSistemaApi: {
    getAll: jest.fn(() => Promise.resolve([usuarioSistema])),
    getById: jest.fn(() => Promise.resolve(usuarioSistema)),
    create: jest.fn(() => Promise.resolve(usuarioSistema)),
    update: jest.fn(() => Promise.resolve(usuarioSistema)),
    delete: jest.fn(() => Promise.resolve({})),
  },
  rolesApi: {
    getAll: jest.fn(() => Promise.resolve([rol])),
    getById: jest.fn(() => Promise.resolve(rol)),
    create: jest.fn(() => Promise.resolve(rol)),
    update: jest.fn(() => Promise.resolve(rol)),
    delete: jest.fn(() => Promise.resolve({})),
  },
  prestamosApi: {
    getAll: jest.fn(() => Promise.resolve([prestamo])),
    getById: jest.fn(() => Promise.resolve(prestamo)),
    create: jest.fn(() => Promise.resolve(prestamo)),
    update: jest.fn(() => Promise.resolve(prestamo)),
    delete: jest.fn(() => Promise.resolve({})),
  },
  auditoriaApi: {
    getAll: jest.fn(() =>
      Promise.resolve([
        {
          id_auditoria: 1,
          tabla_afectada: "libro",
          id_registro: 1,
          accion: "INSERT",
          usuario_sistema: "dpilaguano",
          fecha_evento: "2026-06-20",
          valor_anterior: "",
          valor_nuevo: "{}",
        },
      ]),
    ),
  },
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

export { React, cleanup, fireEvent, render, screen, waitFor };

export const renderPagina = async (Component, expected) => {
  const result = render(React.createElement(Component));

  await waitFor(() => {
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(expected);
  });

  return result;
};

export const input = (container, name) => container.querySelector(`[name="${name}"]`);

export const cambiar = (container, name, value) => {
  fireEvent.change(input(container, name), { target: { name, value } });
};

export const enviar = (container) => {
  fireEvent.submit(container.querySelector("form"));
};
