'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { autoresApi } from '@/lib/api';
import { CreateAutorDto } from '@/types/biblioteca';

export default function CrearAutorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateAutorDto>({
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    nacionalidad: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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

    if (!formData.primer_nombre || !formData.primer_apellido) {
      setError('Por favor completa el nombre y apellido del autor');
      setLoading(false);
      return;
    }

    try {
      await autoresApi.create(formData);
      router.push('/libros/crear');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando autor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/libros/crear" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Crear Libro
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Crear Autor</h1>
        <p className="text-slate-600 mt-1">Registra un nuevo autor de libros</p>
      </div>

      <div className="bg-white rounded shadow p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Márquez"
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
              Nacionalidad
            </label>
            <input
              type="text"
              name="nacionalidad"
              value={formData.nacionalidad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Colombiana, Española, Mexicana"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Autor'}
            </button>
            <Link
              href="/libros/crear"
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
