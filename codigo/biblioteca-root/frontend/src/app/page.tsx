'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { prestamosApi } from '@/lib/api';

export default function Dashboard() {
  const [prestamosCount, setPrestamosCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prestamos = await prestamosApi.getAll();
        setPrestamosCount(prestamos.length);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Sistema de Gestión de Biblioteca</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-slate-600 text-sm font-medium">Préstamos Activos</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? '-' : prestamosCount}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-slate-600 text-sm font-medium">Libros en Sistema</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">-</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-slate-600 text-sm font-medium">Usuarios Registrados</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">-</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-slate-600 text-sm font-medium">Ejemplares Disponibles</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">-</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-2">
            <Link
              href="/prestamos/crear"
              className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center"
            >
              Crear Préstamo
            </Link>
            <Link
              href="/libros/crear"
              className="block px-4 py-2 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 transition text-center"
            >
              Agregar Libro
            </Link>
            <Link
              href="/usuarios/crear"
              className="block px-4 py-2 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 transition text-center"
            >
              Registrar Usuario
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Módulos Disponibles</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/libros" className="text-blue-600 hover:underline">
                Gestión de Libros
              </Link>
            </li>
            <li>
              <Link href="/ejemplares" className="text-blue-600 hover:underline">
                Gestión de Ejemplares
              </Link>
            </li>
            <li>
              <Link href="/usuarios" className="text-blue-600 hover:underline">
                Gestión de Usuarios
              </Link>
            </li>
            <li>
              <Link href="/roles" className="text-blue-600 hover:underline">
                Gestión de Roles
              </Link>
            </li>
            <li>
              <Link href="/prestamos" className="text-blue-600 hover:underline">
                Gestión de Préstamos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}