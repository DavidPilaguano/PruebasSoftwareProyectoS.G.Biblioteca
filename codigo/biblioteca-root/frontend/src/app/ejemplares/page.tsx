'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ejemplaresApi } from '@/lib/api';
import { Ejemplar } from '@/types/biblioteca';

export default function EjemplaresPage() {
  const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEjemplares = async () => {
      try {
        const data = await ejemplaresApi.getAll();
        setEjemplares(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando ejemplares');
      } finally {
        setLoading(false);
      }
    };

    fetchEjemplares();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Deseas eliminar este ejemplar?')) return;

    try {
      await ejemplaresApi.delete(id);
      setEjemplares(ejemplares.filter(e => e.id_ejemplar !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error eliminando ejemplar');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ejemplares</h1>
          <p className="text-slate-600 mt-1">Gestión de copias de libros</p>
        </div>
        <Link
          href="/ejemplares/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Crear Ejemplar
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-slate-600">Cargando ejemplares...</div>
        ) : ejemplares.length === 0 ? (
          <div className="p-6 text-center text-slate-600">No hay ejemplares registrados</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Código</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Ubicación</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Fecha Adquisición</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ejemplares.map((ejemplar) => (
                <tr key={ejemplar.id_ejemplar} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-900">{ejemplar.codigo_barra || '-'}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      ejemplar.estado === 'DISPONIBLE'
                        ? 'bg-green-100 text-green-800'
                        : ejemplar.estado === 'PRESTADO'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ejemplar.estado}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{ejemplar.ubicacion_fisica || '-'}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {ejemplar.fecha_adquisicion
                      ? new Date(ejemplar.fecha_adquisicion).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <Link
                      href={`/ejemplares/${ejemplar.id_ejemplar}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(ejemplar.id_ejemplar)}
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
