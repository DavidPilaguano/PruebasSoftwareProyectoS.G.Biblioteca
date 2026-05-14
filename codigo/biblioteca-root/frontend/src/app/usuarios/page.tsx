'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usuariosApi } from '@/lib/api';
import { Usuario } from '@/types/biblioteca';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await usuariosApi.getAll();
        setUsuarios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Deseas eliminar este usuario?')) return;

    try {
      await usuariosApi.delete(id);
      setUsuarios(usuarios.filter(u => u.id_usuario !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error eliminando usuario');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Usuarios/Estudiantes</h1>
          <p className="text-slate-600 mt-1">Gestión de usuarios del sistema</p>
        </div>
        <Link
          href="/usuarios/crear"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Crear Usuario
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-slate-600">Cargando usuarios...</div>
        ) : usuarios.length === 0 ? (
          <div className="p-6 text-center text-slate-600">No hay usuarios registrados</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Cédula</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Correo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id_usuario} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-900">
                    {usuario.primer_nombre} {usuario.primer_apellido}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{usuario.cedula || '-'}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{usuario.correo}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      usuario.estado === 'ACTIVO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <Link
                      href={`/usuarios/${usuario.id_usuario}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(usuario.id_usuario)}
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
