'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usuariosSistemaApi } from '@/lib/api';
import { UsuarioSistema, UpdateUsuarioSistemaDto } from '@/types/biblioteca';

export default function EditarUsuarioSistemaPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<UsuarioSistema | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<UpdateUsuarioSistemaDto>({
    username: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    estado: 'ACTIVO',
    rol_sistema: 'BIBLIOTECARIO',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const usuarioData = await usuariosSistemaApi.getById(id);
        setUsuario(usuarioData);
        setFormData({
          username: usuarioData.username,
          primer_nombre: usuarioData.primer_nombre,
          segundo_nombre: usuarioData.segundo_nombre || '',
          primer_apellido: usuarioData.primer_apellido,
          segundo_apellido: usuarioData.segundo_apellido || '',
          estado: usuarioData.estado as any,
          rol_sistema: usuarioData.rol_sistema as any,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando usuario del sistema');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await usuariosSistemaApi.update(id, formData);
      router.push('/usuarios-sistema');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando usuario del sistema');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-600">Cargando...</div>;
  }

  if (!usuario) {
    return <div className="p-6 text-center text-red-600">Usuario no encontrado</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/usuarios-sistema" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Usuarios del Sistema
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Editar Usuario del Sistema</h1>
        <p className="text-slate-600 mt-1">{usuario.primer_nombre} {usuario.primer_apellido}</p>
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
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
            />
            <p className="text-xs text-slate-500 mt-1">El nombre de usuario no puede modificarse</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Primer Nombre
              </label>
              <input
                type="text"
                name="primer_nombre"
                value={formData.primer_nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Primer Apellido
              </label>
              <input
                type="text"
                name="primer_apellido"
                value={formData.primer_apellido}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="BLOQUEADO">Bloqueado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Rol en el Sistema
              </label>
              <select
                name="rol_sistema"
                value={formData.rol_sistema}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BIBLIOTECARIO">Bibliotecario</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <Link
              href="/usuarios-sistema"
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
