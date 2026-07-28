"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ejemplaresApi, librosApi, prestamosApi, usuariosApi } from "@/lib/api";

interface DashboardStats {
  libros: number;
  usuarios: number;
  ejemplares: number;
}

interface DashboardMetrics {
  prestamosActivos: number;
  prestamosDevueltos: number;
  ejemplaresDisponibles: number;
  ejemplaresPrestados: number;
  usuariosActivos: number;
  librosRegistrados: number;
}

const initialMetrics: DashboardMetrics = {
  prestamosActivos: 0,
  prestamosDevueltos: 0,
  ejemplaresDisponibles: 0,
  ejemplaresPrestados: 0,
  usuariosActivos: 0,
  librosRegistrados: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    libros: 0,
    usuarios: 0,
    ejemplares: 0,
  });
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [prestamos, statsData, ejemplares, usuarios, libros] =
          await Promise.all([
            prestamosApi.getAll(),
            librosApi.getDashboardStats(),
            ejemplaresApi.getAll(),
            usuariosApi.getAll(),
            librosApi.getAll(),
          ]);

        setMetrics({
          prestamosActivos: prestamos.filter(
            (prestamo: { estado?: string }) => prestamo.estado === "ACTIVO",
          ).length,
          prestamosDevueltos: prestamos.filter(
            (prestamo: { estado?: string }) => prestamo.estado === "DEVUELTO",
          ).length,
          ejemplaresDisponibles: ejemplares.filter(
            (ejemplar: { estado?: string }) => ejemplar.estado === "DISPONIBLE",
          ).length,
          ejemplaresPrestados: ejemplares.filter(
            (ejemplar: { estado?: string }) => ejemplar.estado === "PRESTADO",
          ).length,
          usuariosActivos: usuarios.filter(
            (usuario: { estado?: string }) => usuario.estado === "ACTIVO",
          ).length,
          librosRegistrados: libros.length,
        });
        setStats(statsData);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const disponibilidad =
    stats.ejemplares > 0
      ? Math.round((metrics.ejemplaresDisponibles / stats.ejemplares) * 100)
      : 0;
  const circulacion =
    stats.ejemplares > 0
      ? Math.round((metrics.ejemplaresPrestados / stats.ejemplares) * 100)
      : 0;
  const cobertura =
    stats.libros > 0 ? (stats.ejemplares / stats.libros).toFixed(1) : "0.0";

  const statCards = [
    {
      label: "Prestamos Activos",
      value: metrics.prestamosActivos,
      detail: `${metrics.prestamosDevueltos} devueltos`,
    },
    {
      label: "Libros en Catalogo",
      value: metrics.librosRegistrados || stats.libros,
      detail: `${stats.ejemplares} ejemplares`,
    },
    {
      label: "Usuarios Activos",
      value: metrics.usuariosActivos,
      detail: `${stats.usuarios} registrados`,
    },
    {
      label: "Disponibilidad",
      value: `${disponibilidad}%`,
      detail: `${metrics.ejemplaresDisponibles} disponibles`,
    },
  ];

  return (
    <div>
      <div className="dashboard-hero mb-8">
        <div>
          <p className="app-kicker">Panel ejecutivo</p>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Sistema de Gestion de Biblioteca
          </p>
        </div>
        <Link href="/prestamos/crear" className="hero-action">
          Nuevo prestamo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card bg-white rounded-lg shadow p-6">
            <div className="text-slate-600 text-sm font-medium">
              {card.label}
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "..." : card.value}
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">
              {loading ? "Calculando..." : card.detail}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="action-panel bg-white rounded-lg shadow p-6">
          <p className="app-kicker">Inventario</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-2">
            Salud del catalogo
          </h2>
          <div className="metric-row">
            <span>Disponibilidad</span>
            <strong>{loading ? "..." : `${disponibilidad}%`}</strong>
          </div>
          <div className="metric-bar">
            <span style={{ width: `${disponibilidad}%` }} />
          </div>
          <div className="metric-row">
            <span>Circulacion</span>
            <strong>{loading ? "..." : `${circulacion}%`}</strong>
          </div>
          <div className="metric-bar metric-bar-accent">
            <span style={{ width: `${circulacion}%` }} />
          </div>
        </div>

        <div className="action-panel bg-white rounded-lg shadow p-6">
          <p className="app-kicker">Gestion</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-2">
            Cobertura operativa
          </h2>
          <div className="metric-big">{loading ? "..." : cobertura}</div>
          <p className="text-sm text-slate-600 mt-2">
            Ejemplares promedio por libro registrado.
          </p>
        </div>

        <div className="action-panel bg-white rounded-lg shadow p-6">
          <p className="app-kicker">Actividad</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-2">
            Movimiento reciente
          </h2>
          <div className="space-y-3 mt-4 text-sm text-slate-600">
            <p>{metrics.prestamosActivos} prestamos siguen activos.</p>
            <p>{metrics.prestamosDevueltos} prestamos fueron cerrados.</p>
            <p>{metrics.ejemplaresPrestados} ejemplares estan en circulacion.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="action-panel bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Acciones Rapidas
          </h2>
          <div className="space-y-2">
            <Link
              href="/prestamos/crear"
              className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center"
            >
              Crear Prestamo
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
            Modulos Disponibles
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/libros" className="text-blue-600 hover:underline">
                Gestion de Libros
              </Link>
            </li>
            <li>
              <Link
                href="/ejemplares"
                className="text-blue-600 hover:underline"
              >
                Gestion de Ejemplares
              </Link>
            </li>
            <li>
              <Link href="/usuarios" className="text-blue-600 hover:underline">
                Gestion de Usuarios
              </Link>
            </li>
            <li>
              <Link href="/roles" className="text-blue-600 hover:underline">
                Gestion de Roles
              </Link>
            </li>
            <li>
              <Link href="/prestamos" className="text-blue-600 hover:underline">
                Gestion de Prestamos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
