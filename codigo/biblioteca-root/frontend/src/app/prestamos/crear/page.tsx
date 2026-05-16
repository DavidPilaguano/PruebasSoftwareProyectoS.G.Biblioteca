'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { prestamosApi, usuariosApi, usuariosSistemaApi, ejemplaresApi } from '@/lib/api';
import { CreatePrestamoDto, Usuario, UsuarioSistema, Ejemplar } from '@/types/biblioteca';

export default function CrearPrestamoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosSistema, setUsuariosSistema] = useState<UsuarioSistema[]>([]);
  const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<CreatePrestamoDto>({
    id_usuario: 0,
    id_usuario_sistema: 0,
    id_ejemplar: 0,
    fecha_devolucion_esperada: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usrs, usrSist, ejems] = await Promise.all([
          usuariosApi.getAll(),
          usuariosSistemaApi.getAll(),
          ejemplaresApi.getAll(),
        ]);
        setUsuarios(usrs);
        setUsuariosSistema(usrSist);
        // Filtrar solo ejemplares disponibles
        setEjemplares(ejems.filter((e: Ejemplar) => e.estado === 'DISPONIBLE'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando datos');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('id_') ? parseInt(value) : value,
    }));
  };

  const calculateExpectedReturn = () => {
    const today = new Date();
    today.setDate(today.getDate() + 14); // Default 14 días
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.id_usuario || !formData.id_usuario_sistema || !formData.id_ejemplar) {
      setError('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    const submitData = {
      ...formData,
      fecha_devolucion_esperada: formData.fecha_devolucion_esperada || calculateExpectedReturn(),
    };

    try {
      await prestamosApi.create(submitData);
      router.push('/prestamos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando préstamo');
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
        <Link href="/prestamos" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Préstamos
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Crear Préstamo</h1>
        <p className="text-slate-600 mt-1">Registra un nuevo préstamo de libro</p>
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
              Usuario/Estudiante *
            </label>
            <select
              name="id_usuario"
              value={formData.id_usuario}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Selecciona un usuario</option>
              {usuarios.map((usr) => (
                <option key={usr.id_usuario} value={usr.id_usuario}>
                  {usr.primer_nombre} {usr.primer_apellido} ({usr.codigo_institucional})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Bibliotecario Registrador *
            </label>
            <select
              name="id_usuario_sistema"
              value={formData.id_usuario_sistema}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Selecciona un bibliotecario</option>
              {usuariosSistema.map((usr) => (
                <option key={usr.id_usuario_sistema} value={usr.id_usuario_sistema}>
                  {usr.primer_nombre} {usr.primer_apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Ejemplar (Copia del Libro) *
            </label>
            <select
              name="id_ejemplar"
              value={formData.id_ejemplar}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Selecciona un ejemplar disponible</option>
              {ejemplares.map((ej) => (
                <option key={ej.id_ejemplar} value={ej.id_ejemplar}>
                  {ej.libro?.titulo} - Código: {ej.codigo_barra || 'N/A'}
                </option>
              ))}
            </select>
            {ejemplares.length === 0 && (
              <p className="text-xs text-red-600 mt-1">No hay ejemplares disponibles para prestar</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Fecha de Devolución Esperada
            </label>
            <input
              type="date"
              name="fecha_devolucion_esperada"
              value={formData.fecha_devolucion_esperada}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-slate-600 mt-1">Si no especificas, será 14 días desde hoy</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Préstamo'}
            </button>
            <Link
              href="/prestamos"
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
