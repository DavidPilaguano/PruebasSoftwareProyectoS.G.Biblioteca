const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: unknown
) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la solicitud');
  }

  return response.json();
};

// Libros
export const librosApi = {
  getAll: () => apiCall('/libros'),
  getDashboardStats: () => apiCall('/libros/dashboard/stats'),
  getById: (id: number) => apiCall(`/libros/${id}`),
  create: (data: unknown) => apiCall('/libros', 'POST', data),
  update: (id: number, data: unknown) => apiCall(`/libros/${id}`, 'PATCH', data),
  delete: (id: number) => apiCall(`/libros/${id}`, 'DELETE'),
};

// Ejemplares
export const ejemplaresApi = {
  getAll: () => apiCall('/ejemplares'),
  getById: (id: number) => apiCall(`/ejemplares/${id}`),
  create: (data: unknown) => apiCall('/ejemplares', 'POST', data),
  update: (id: number, data: unknown) => apiCall(`/ejemplares/${id}`, 'PATCH', data),
  delete: (id: number) => apiCall(`/ejemplares/${id}`, 'DELETE'),
};

// Usuarios
export const usuariosApi = {
  getAll: () => apiCall('/usuarios'),
  getById: (id: number) => apiCall(`/usuarios/${id}`),
  create: (data: unknown) => apiCall('/usuarios', 'POST', data),
  update: (id: number, data: unknown) => apiCall(`/usuarios/${id}`, 'PATCH', data),
  delete: (id: number) => apiCall(`/usuarios/${id}`, 'DELETE'),
};

// Roles
export const rolesApi = {
  getAll: () => apiCall('/roles'),
  getById: (id: number) => apiCall(`/roles/${id}`),
  create: (data: unknown) => apiCall('/roles', 'POST', data),
  update: (id: number, data: unknown) => apiCall(`/roles/${id}`, 'PATCH', data),
  delete: (id: number) => apiCall(`/roles/${id}`, 'DELETE'),
};

// Préstamos
export const prestamosApi = {
  getAll: () => apiCall('/prestamos'),
  getById: (id: number) => apiCall(`/prestamos/${id}`),
  create: (data: unknown) => apiCall('/prestamos', 'POST', data),
  update: (id: number, data: unknown) => apiCall(`/prestamos/${id}`, 'PATCH', data),
  delete: (id: number) => apiCall(`/prestamos/${id}`, 'DELETE'),
};

// Usuarios del Sistema
export const usuariosSistemaApi = {
  getAll: () => apiCall('/usuarios-sistema'),
  getById: (id: number) => apiCall(`/usuarios-sistema/${id}`),
  create: (data: unknown) => apiCall('/usuarios-sistema', 'POST', data),
  update: (id: number, data: unknown) => apiCall(`/usuarios-sistema/${id}`, 'PATCH', data),
  delete: (id: number) => apiCall(`/usuarios-sistema/${id}`, 'DELETE'),
};

// Auditoría
export const auditoriaApi = {
  getAll: () => apiCall('/auditoria'),
};


export const categoriasApi = {
  getAll: () => apiCall('/categorias'),
  getById: (id: number) => apiCall(`/categorias/${id}`),
  create: (data: unknown) => apiCall('/categorias', 'POST', data),
  update: (id: number, data: unknown) => apiCall(`/categorias/${id}`, 'PATCH', data),
  delete: (id: number) => apiCall(`/categorias/${id}`, 'DELETE'),
};

export const editorialesApi = {
  getAll: () => apiCall('/editoriales'),
  getById: (id: number) => apiCall(`/editoriales/${id}`),
  create: (data: unknown) => apiCall('/editoriales', 'POST', data),
  update: (id: number, data: unknown) => apiCall(`/editoriales/${id}`, 'PATCH', data),
  delete: (id: number) => apiCall(`/editoriales/${id}`, 'DELETE'),
};

export const authApi = {
  login: (username: string, password_hash: string) => 
    apiCall('/auth/login', 'POST', { username, password_hash }),
};

export const autoresApi = {
  getAll: () => apiCall('/autores'),
  getById: (id: number) => apiCall(`/autores/${id}`),
  create: (data: unknown) => apiCall('/autores', 'POST', data),
  update: (id: number, data: unknown) => apiCall(`/autores/${id}`, 'PATCH', data),
  delete: (id: number) => apiCall(`/autores/${id}`, 'DELETE'),
};
