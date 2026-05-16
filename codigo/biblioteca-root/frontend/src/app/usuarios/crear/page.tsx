'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usuariosApi, rolesApi } from '@/lib/api';
import { CreateUsuarioDto, RolUsuario } from '@/types/biblioteca';

export default function CrearUsuarioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<RolUsuario[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<CreateUsuarioDto>({
    cedula: '',
    codigo_institucional: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    correo: '',
    telefono: '',
    estado: 'ACTIVO',
    id_rol: 0,
  });

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await rolesApi.getAll();
        setRoles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando roles');
      } finally {
        setLoadingData(false);
      }
    };

    loadRoles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'id_rol' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.codigo_institucional || !formData.primer_nombre || !formData.primer_apellido || !formData.correo || !formData.id_rol) {
      setError('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    try {
      await usuariosApi.create(formData);
      router.push('/usuarios');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando usuario');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="p-6 text-center text-slate-600">Cargando datos...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/usuarios" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Usuarios
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Crear Usuario/Estudiante</h1>
        <p className="text-slate-600 mt-1">Registra un nuevo usuario en el sistema</p>
      </div>

      <div className="bg-white rounded shadow p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Cédula
            </label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Código Institucional *
            </label>
            <input
              type="text"
              name="codigo_institucional"
              value={formData.codigo_institucional}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: EST2024001"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Primer Nombre *
              </label>
              <input
                type="text"
                name="primer_nombre"
                value={formData.primer_nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Segundo Nombre
              </label>
              <input
                type="text"
                name="segundo_nombre"
                value={formData.segundo_nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Carlos"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Primer Apellido *
              </label>
              <input
                type="text"
                name="primer_apellido"
                value={formData.primer_apellido}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Segundo Apellido
              </label>
              <input
                type="text"
                name="segundo_apellido"
                value={formData.segundo_apellido}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="García"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+57 300 1234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Rol *
            </label>
            <select
              name="id_rol"
              value={formData.id_rol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.id_rol} value={rol.id_rol}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
            <Link
              href="/usuarios"
              className="flex-1 bg-slate-300 text-slate-900 py-2 rounded-lg hover:bg-slate-400 transition text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
