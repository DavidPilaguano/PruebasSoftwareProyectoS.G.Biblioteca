'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { prestamosApi } from '@/lib/api';
import { Prestamo } from '@/types/biblioteca';

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const data = await prestamosApi.getAll();
        setPrestamos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando préstamos');
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Deseas cancelar este préstamo?')) return;

    try {
      await prestamosApi.delete(id);
      setPrestamos(prestamos.filter(p => p.id_prestamo !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error cancelando préstamo');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Préstamos</h1>
          <p className="text-slate-600 mt-1">Gestión de préstamos de libros</p>
        </div>
        <Link
          href="/prestamos/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Crear Préstamo
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-slate-600">Cargando préstamos...</div>
        ) : prestamos.length === 0 ? (
          <div className="p-6 text-center text-slate-600">No hay préstamos registrados</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Usuario</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Fecha Préstamo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Devolución Esperada</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((prestamo) => (
                <tr key={prestamo.id_prestamo} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-900">{prestamo.id_prestamo}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{prestamo.id_usuario}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {new Date(prestamo.fecha_prestamo).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {prestamo.fecha_devolucion_esperada
                      ? new Date(prestamo.fecha_devolucion_esperada).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      prestamo.estado === 'ACTIVO'
                        ? 'bg-blue-100 text-blue-800'
                        : prestamo.estado === 'DEVUELTO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {prestamo.estado}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <Link
                      href={`/prestamos/${prestamo.id_prestamo}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(prestamo.id_prestamo)}
                      className="text-red-600 hover:underline"
                    >
                      Cancelar
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
