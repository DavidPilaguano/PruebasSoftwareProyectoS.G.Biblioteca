'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { prestamosApi } from '@/lib/api';
import { Prestamo, UpdatePrestamoDto } from '@/types/biblioteca';

export default function EditarPrestamoPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prestamo, setPrestamo] = useState<Prestamo | null>(null);

  const [formData, setFormData] = useState<UpdatePrestamoDto>({
    estado: 'ACTIVO',
    fecha_devolucion_real: undefined,
    fecha_devolucion_esperada: undefined,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const prestamoData = await prestamosApi.getById(id);
        setPrestamo(prestamoData);
        setFormData({
          estado: prestamoData.estado,
          fecha_devolucion_real: prestamoData.fecha_devolucion_real || undefined,
          fecha_devolucion_esperada: prestamoData.fecha_devolucion_esperada || undefined,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando préstamo');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await prestamosApi.update(id, formData);
      router.push('/prestamos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando préstamo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-600">Cargando...</div>;
  }

  if (!prestamo) {
    return <div className="p-6 text-center text-red-600">Préstamo no encontrado</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/prestamos" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Préstamos
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Editar Préstamo</h1>
        <p className="text-slate-600 mt-1">Préstamo #{prestamo.id_prestamo}</p>
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
              Usuario
            </label>
            <input
              type="text"
              disabled
              value={prestamo.usuario ? `${prestamo.usuario.primer_nombre} ${prestamo.usuario.primer_apellido}` : 'No disponible'}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Libro
            </label>
            <input
              type="text"
              disabled
              value={prestamo.libro?.titulo || 'No disponible'}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Fecha de Préstamo
            </label>
            <input
              type="text"
              disabled
              value={new Date(prestamo.fecha_prestamo).toLocaleDateString()}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVO">Activo</option>
              <option value="DEVUELTO">Devuelto</option>
              <option value="ATRASADO">Atrasado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Fecha Devolución Esperada
            </label>
            <input
              type="date"
              name="fecha_devolucion_esperada"
              value={formData.fecha_devolucion_esperada || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Fecha Devolución Real
            </label>
            <input
              type="date"
              name="fecha_devolucion_real"
              value={formData.fecha_devolucion_real || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              href="/prestamos"
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
