'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { editorialesApi } from '@/lib/api';
import { CreateEditorialDto } from '@/types/biblioteca';

export default function CrearEditorialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateEditorialDto>({
    nombre: '',
    pais: '',
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

    if (!formData.nombre) {
      setError('Por favor completa el nombre de la editorial');
      setLoading(false);
      return;
    }

    try {
      await editorialesApi.create(formData);
      router.push('/libros/crear');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando editorial');
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
        <h1 className="text-3xl font-bold text-slate-900">Crear Editorial</h1>
        <p className="text-slate-600 mt-1">Agrega una nueva editorial</p>
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
              Nombre de la Editorial *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Penguin Books, Editorial Planeta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              País
            </label>
            <input
              type="text"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: España, Reino Unido, Colombia"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Editorial'}
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
