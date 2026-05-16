'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ejemplaresApi, librosApi } from '@/lib/api';
import { CreateEjemplarDto, Libro } from '@/types/biblioteca';

export default function CrearEjemplarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<CreateEjemplarDto>({
    codigo_barra: '',
    id_libro: 0,
    estado: 'DISPONIBLE',
    ubicacion_fisica: '',
    fecha_adquisicion: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const loadLibros = async () => {
      try {
        const data = await librosApi.getAll();
        setLibros(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando libros');
      } finally {
        setLoadingData(false);
      }
    };

    loadLibros();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'id_libro' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.id_libro) {
      setError('Por favor selecciona un libro');
      setLoading(false);
      return;
    }

    try {
      await ejemplaresApi.create(formData);
      router.push('/ejemplares');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando ejemplar');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="p-6 text-center text-slate-600">Cargando datos...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/ejemplares" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Ejemplares
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Crear Ejemplar</h1>
        <p className="text-slate-600 mt-1">Registra una nueva copia de un libro</p>
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
              Libro *
            </label>
            <select
              name="id_libro"
              value={formData.id_libro}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Selecciona un libro</option>
              {libros.map((libro) => (
                <option key={libro.id_libro} value={libro.id_libro}>
                  {libro.titulo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Código de Barra
            </label>
            <input
              type="text"
              name="codigo_barra"
              value={formData.codigo_barra}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 123456789"
            />
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

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Fecha de Adquisición
            </label>
            <input
              type="date"
              name="fecha_adquisicion"
              value={formData.fecha_adquisicion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Ejemplar'}
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
