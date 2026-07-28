"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { prestamosApi, librosApi } from "@/lib/api";

interface DashboardStats {
  libros: number;
  usuarios: number;
  ejemplares: number;
}

const statCards = [
  { label: "Préstamos Activos", key: "prestamos" },
  { label: "Libros en Sistema", key: "libros" },
  { label: "Usuarios Registrados", key: "usuarios" },
  { label: "Ejemplares Disponibles", key: "ejemplares" },
];

export default function Dashboard() {
  const [prestamosCount, setPrestamosCount] = useState(0);
  const [stats, setStats] = useState<DashboardStats>({
    libros: 0,
    usuarios: 0,
    ejemplares: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [prestamos, statsData] = await Promise.all([
          prestamosApi.getAll(),
          librosApi.getDashboardStats(),
        ]);

        setPrestamosCount(prestamos.length);
        setStats(statsData);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const values: Record<string, number> = {
    prestamos: prestamosCount,
    libros: stats.libros,
    usuarios: stats.usuarios,
    ejemplares: stats.ejemplares,
  };

  return (
    <div>
      <div className="dashboard-hero mb-8">
        <div>
          <p className="app-kicker">Panel ejecutivo</p>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Sistema de Gestión de Biblioteca
          </p>
        </div>
        <Link href="/prestamos/crear" className="hero-action">
          Nuevo préstamo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.key} className="stat-card bg-white rounded-lg shadow p-6">
            <div className="text-slate-600 text-sm font-medium">
              {card.label}
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "..." : values[card.key]}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="action-panel bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Acciones Rápidas
          </h2>
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

        <div className="action-panel bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Módulos Disponibles
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/libros" className="text-blue-600 hover:underline">
                Gestión de Libros
              </Link>
            </li>
            <li>
              <Link
                href="/ejemplares"
                className="text-blue-600 hover:underline"
              >
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
