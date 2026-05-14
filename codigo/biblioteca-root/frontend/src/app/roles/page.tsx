'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { rolesApi } from '@/lib/api';
import { RolUsuario } from '@/types/biblioteca';

export default function RolesPage() {
  const [roles, setRoles] = useState<RolUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await rolesApi.getAll();
        setRoles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Deseas eliminar este rol?')) return;

    try {
      await rolesApi.delete(id);
      setRoles(roles.filter(r => r.id_rol !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error eliminando rol');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Roles de Usuario</h1>
          <p className="text-slate-600 mt-1">Gestión de roles y permisos</p>
        </div>
        <Link
          href="/roles/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Crear Rol
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-slate-600">Cargando roles...</div>
        ) : roles.length === 0 ? (
          <div className="p-6 text-center text-slate-600">No hay roles registrados</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Máximo Préstamos</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Días Préstamo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((rol) => (
                <tr key={rol.id_rol} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-900">{rol.nombre}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{rol.max_prestamos}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{rol.dias_prestamo}</td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <Link
                      href={`/roles/${rol.id_rol}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(rol.id_rol)}
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
