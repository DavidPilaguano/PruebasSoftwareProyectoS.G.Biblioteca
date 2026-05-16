'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { usuariosSistemaApi } from '@/lib/api';
import { CreateUsuarioSistemaDto } from '@/types/biblioteca';

export default function CrearUsuarioSistemaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<CreateUsuarioSistemaDto>({
    username: '',
    password_hash: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    estado: 'ACTIVO',
    rol_sistema: 'BIBLIOTECARIO',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.username || !formData.password_hash || !formData.primer_nombre || !formData.primer_apellido) {
      setError('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    if (formData.password_hash.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await usuariosSistemaApi.create(formData);
      router.push('/usuarios-sistema');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando usuario del sistema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/usuarios-sistema" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Usuarios del Sistema
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Crear Usuario del Sistema</h1>
        <p className="text-slate-600 mt-1">Registra un nuevo bibliotecario o administrador</p>
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
              Nombre de Usuario (Username) *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: jperez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password_hash"
                value={formData.password_hash}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-slate-600 text-sm"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
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
              Rol en el Sistema *
            </label>
            <select
              name="rol_sistema"
              value={formData.rol_sistema}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BIBLIOTECARIO">Bibliotecario</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-900">
            <strong>Nota:</strong> El estado inicial será "ACTIVO". Los usuarios del sistema pueden ser modificados después de su creación.
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
              href="/usuarios-sistema"
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
