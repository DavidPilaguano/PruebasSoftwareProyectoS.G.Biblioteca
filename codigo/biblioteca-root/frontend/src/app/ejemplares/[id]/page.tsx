'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ejemplaresApi, librosApi } from '@/lib/api';
import { Ejemplar, UpdateEjemplarDto, Libro } from '@/types/biblioteca';

export default function EditarEjemplarPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ejemplar, setEjemplar] = useState<Ejemplar | null>(null);
  const [libros, setLibros] = useState<Libro[]>([]);

  const [formData, setFormData] = useState<UpdateEjemplarDto>({
    estado: 'DISPONIBLE',
    ubicacion_fisica: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ejemplarData, librosData] = await Promise.all([
          ejemplaresApi.getById(id),
          librosApi.getAll(),
        ]);
        setEjemplar(ejemplarData);
        setLibros(librosData);
        setFormData({
          estado: ejemplarData.estado,
          ubicacion_fisica: ejemplarData.ubicacion_fisica || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando ejemplar');
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
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await ejemplaresApi.update(id, formData);
      router.push('/ejemplares');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando ejemplar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-600">Cargando...</div>;
  }

  if (!ejemplar) {
    return <div className="p-6 text-center text-red-600">Ejemplar no encontrado</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/ejemplares" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Ejemplares
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Editar Ejemplar</h1>
        <p className="text-slate-600 mt-1">Código: {ejemplar.codigo_barra || 'N/A'}</p>
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
              Libro
            </label>
            <input
              type="text"
              disabled
              value={ejemplar.libro?.titulo || 'No disponible'}
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
              <option value="DISPONIBLE">Disponible</option>
              <option value="PRESTADO">Prestado</option>
              <option value="DANIADO">Dañado</option>
              <option value="PERDIDO">Perdido</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Ubicación Física
            </label>
            <input
              type="text"
              name="ubicacion_fisica"
              value={formData.ubicacion_fisica}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Estante A-5"
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
              href="/ejemplares"
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
