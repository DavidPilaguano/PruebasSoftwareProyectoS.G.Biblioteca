'use client';

import { useEffect, useState } from 'react';
import { auditoriaApi } from '@/lib/api';
import { Auditoria } from '@/types/biblioteca';

export default function AuditoriaPage() {
  const [registros, setRegistros] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditoria = async () => {
      try {
        const data = await auditoriaApi.getAll();
        setRegistros(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando auditoría');
      } finally {
        setLoading(false);
      }
    };

    fetchAuditoria();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Auditoría</h1>
        <p className="text-slate-600 mt-1">Registro de cambios del sistema</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-slate-600">Cargando auditoría...</div>
        ) : registros.length === 0 ? (
          <div className="p-6 text-center text-slate-600">No hay registros de auditoría</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Acción</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Tabla</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">ID Registro</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Usuario</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id_auditoria} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {new Date(registro.fecha_evento).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      registro.accion === 'INSERT'
                        ? 'bg-green-100 text-green-800'
                        : registro.accion === 'UPDATE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {registro.accion}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-900">{registro.tabla_afectada}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{registro.id_registro}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{registro.usuario_sistema}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {registro.valor_nuevo && (
                      <details className="cursor-pointer">
                        <summary className="text-blue-600 hover:underline">Ver</summary>
                        <div className="mt-2 bg-slate-50 p-2 rounded text-xs max-h-20 overflow-auto">
                          {registro.valor_nuevo}
                        </div>
                      </details>
                    )}
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
