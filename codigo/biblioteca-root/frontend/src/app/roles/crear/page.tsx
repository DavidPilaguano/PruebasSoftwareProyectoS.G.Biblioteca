'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { rolesApi } from '@/lib/api';
import { CreateRolUsuarioDto } from '@/types/biblioteca';

export default function CrearRolPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateRolUsuarioDto>({
    nombre: '',
    max_prestamos: 5,
    dias_prestamo: 14,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'max_prestamos' || name === 'dias_prestamo' 
        ? parseInt(value) 
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.nombre || formData.max_prestamos <= 0 || formData.dias_prestamo <= 0) {
      setError('Por favor completa todos los campos correctamente');
      setLoading(false);
      return;
    }

    try {
      await rolesApi.create(formData);
      router.push('/roles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando rol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/roles" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Roles
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Crear Rol de Usuario</h1>
        <p className="text-slate-600 mt-1">Define un nuevo rol con sus límites de préstamo</p>
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
              Nombre del Rol *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Estudiante, Profesor, Visitante"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Máximo de Préstamos Simultáneos *
            </label>
            <input
              type="number"
              name="max_prestamos"
              value={formData.max_prestamos}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
            />
            <p className="text-xs text-slate-600 mt-1">Cantidad máxima de libros que puede tener prestados simultáneamente</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Días de Préstamo *
            </label>
            <input
              type="number"
              name="dias_prestamo"
              value={formData.dias_prestamo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="365"
            />
            <p className="text-xs text-slate-600 mt-1">Cantidad de días que se puede prestar un libro</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Rol'}
            </button>
            <Link
              href="/roles"
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
