'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { rolesApi } from '@/lib/api';
import { RolUsuario, UpdateRolUsuarioDto } from '@/types/biblioteca';

export default function EditarRolPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rol, setRol] = useState<RolUsuario | null>(null);

  const [formData, setFormData] = useState<UpdateRolUsuarioDto>({
    nombre: '',
    max_prestamos: 0,
    dias_prestamo: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const rolData = await rolesApi.getById(id);
        setRol(rolData);
        setFormData({
          nombre: rolData.nombre,
          max_prestamos: rolData.max_prestamos,
          dias_prestamo: rolData.dias_prestamo,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando rol');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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
    setSaving(true);
    setError(null);

    try {
      await rolesApi.update(id, formData);
      router.push('/roles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando rol');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-600">Cargando...</div>;
  }

  if (!rol) {
    return <div className="p-6 text-center text-red-600">Rol no encontrado</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/roles" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Roles
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Editar Rol</h1>
        <p className="text-slate-600 mt-1">{rol.nombre}</p>
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
              Nombre del Rol
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Máximo de Préstamos Simultáneos
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
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Días de Préstamo
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
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
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
