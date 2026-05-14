'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usuariosSistemaApi } from '@/lib/api';
import { UsuarioSistema } from '@/types/biblioteca';

export default function UsuariosSistemaPage() {
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await usuariosSistemaApi.getAll();
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
    if (!confirm('¿Deseas eliminar este usuario del sistema?')) return;

    try {
      await usuariosSistemaApi.delete(id);
      setUsuarios(usuarios.filter(u => u.id_usuario_sistema !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error eliminando usuario');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Usuarios del Sistema</h1>
          <p className="text-slate-600 mt-1">Gestión de bibliotecarios</p>
        </div>
        <Link
          href="/usuarios-sistema/crear"
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
          <div className="p-6 text-center text-slate-600">No hay usuarios del sistema</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Usuario</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Rol</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id_usuario_sistema} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-900">{usuario.username}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {usuario.primer_nombre} {usuario.primer_apellido}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{usuario.rol_sistema}</td>
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
                      href={`/usuarios-sistema/${usuario.id_usuario_sistema}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(usuario.id_usuario_sistema)}
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
