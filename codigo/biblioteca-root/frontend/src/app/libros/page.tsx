'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { librosApi } from '@/lib/api';
import { Libro } from '@/types/biblioteca';

export default function LibrosPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const data = await librosApi.getAll();
        setLibros(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando libros');
      } finally {
        setLoading(false);
      }
    };

    fetchLibros();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Deseas eliminar este libro?')) return;

    try {
      await librosApi.delete(id);
      setLibros(libros.filter(l => l.id_libro !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error eliminando libro');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Libros</h1>
          <p className="text-slate-600 mt-1">Gestión del catálogo de libros</p>
        </div>
        <Link
          href="/libros/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Crear Libro
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-slate-600">Cargando libros...</div>
        ) : libros.length === 0 ? (
          <div className="p-6 text-center text-slate-600">No hay libros registrados</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Título</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">ISBN</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Año</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Categoría</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro) => (
                <tr key={libro.id_libro} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-900">{libro.titulo}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{libro.isbn}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{libro.anio_publicacion}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {libro.categoria?.nombre || '-'}
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <Link
                      href={`/libros/${libro.id_libro}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(libro.id_libro)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
