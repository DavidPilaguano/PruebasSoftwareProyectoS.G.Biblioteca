"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ejemplaresApi, librosApi, prestamosApi, usuariosApi } from "@/lib/api";

interface DashboardStats {
  libros: number;
  usuarios: number;
  ejemplares: number;
}

interface LibroDashboard {
  id_libro?: number;
  titulo?: string;
  categoria?: {
    nombre?: string;
  };
}

interface EjemplarDashboard {
  estado?: string;
}

interface PrestamoDashboard {
  estado?: string;
}

interface UsuarioDashboard {
  estado?: string;
}

interface ChartItem {
  label: string;
  value: number;
  percent: number;
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

const countBy = <T,>(
  items: T[],
  getKey: (item: T) => string | undefined,
): Record<string, number> =>
  items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item) || "Sin clasificar";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

const toChartItems = (
  counts: Record<string, number>,
  total: number,
  limit = 6,
): ChartItem[] =>
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({
      label,
      value,
      percent: Math.round((value / Math.max(total, 1)) * 100),
    }));

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    libros: 0,
    usuarios: 0,
    ejemplares: 0,
  });
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [categoryChart, setCategoryChart] = useState<ChartItem[]>([]);
  const [copyChart, setCopyChart] = useState<ChartItem[]>([]);
  const [loanChart, setLoanChart] = useState<ChartItem[]>([]);
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

        const typedPrestamos = prestamos as PrestamoDashboard[];
        const typedEjemplares = ejemplares as EjemplarDashboard[];
        const typedUsuarios = usuarios as UsuarioDashboard[];
        const typedLibros = libros as LibroDashboard[];

        const prestamosActivos = typedPrestamos.filter(
          (prestamo) => prestamo.estado === "ACTIVO",
        ).length;
        const prestamosDevueltos = typedPrestamos.filter(
          (prestamo) => prestamo.estado === "DEVUELTO",
        ).length;
        const ejemplaresDisponibles = typedEjemplares.filter(
          (ejemplar) => ejemplar.estado === "DISPONIBLE",
        ).length;
        const ejemplaresPrestados = typedEjemplares.filter(
          (ejemplar) => ejemplar.estado === "PRESTADO",
        ).length;
        const usuariosActivos = typedUsuarios.filter(
          (usuario) => usuario.estado === "ACTIVO",
        ).length;

        setMetrics({
          prestamosActivos,
          prestamosDevueltos,
          ejemplaresDisponibles,
          ejemplaresPrestados,
          usuariosActivos,
          librosRegistrados: typedLibros.length,
        });
        setStats(statsData as DashboardStats);
        setCategoryChart(
          toChartItems(
            countBy(typedLibros, (libro) => libro.categoria?.nombre),
            typedLibros.length,
          ),
        );
        setCopyChart(
          toChartItems(
            countBy(typedEjemplares, (ejemplar) => ejemplar.estado),
            typedEjemplares.length,
          ),
        );
        setLoanChart(
          toChartItems(
            countBy(typedPrestamos, (prestamo) => prestamo.estado),
            typedPrestamos.length,
            4,
          ),
        );
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
  const catalogoTotal = metrics.librosRegistrados || stats.libros;

  const statCards = [
    {
      label: "Prestamos Activos",
      value: metrics.prestamosActivos,
      detail: `${metrics.prestamosDevueltos} devueltos`,
    },
    {
      label: "Libros en Catalogo",
      value: catalogoTotal,
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
            Gestion visual del catalogo, circulacion e inventario.
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="action-panel chart-panel bg-white rounded-lg shadow p-6">
          <div className="chart-heading">
            <div>
              <p className="app-kicker">Inventario</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">
                Estado de ejemplares
              </h2>
            </div>
            <div
              className="donut-chart"
              style={{
                background: `conic-gradient(var(--brand) 0 ${disponibilidad}%, var(--danger) ${disponibilidad}% 100%)`,
              }}
            >
              <span>{loading ? "..." : `${disponibilidad}%`}</span>
            </div>
          </div>
          <div className="metric-row">
            <span>Disponibles</span>
            <strong>{metrics.ejemplaresDisponibles}</strong>
          </div>
          <div className="metric-bar">
            <span style={{ width: `${disponibilidad}%` }} />
          </div>
          <div className="metric-row">
            <span>En circulacion</span>
            <strong>{metrics.ejemplaresPrestados}</strong>
          </div>
          <div className="metric-bar metric-bar-accent">
            <span style={{ width: `${circulacion}%` }} />
          </div>
        </div>

        <div className="action-panel chart-panel bg-white rounded-lg shadow p-6 xl:col-span-2">
          <div className="chart-heading">
            <div>
              <p className="app-kicker">Catalogo</p>
              <h2 className="text-xl font-semibold text-slate-900 mt-2">
                Libros por categoria
              </h2>
            </div>
            <div className="chart-total">{catalogoTotal}</div>
          </div>
          <div className="bar-chart">
            {categoryChart.map((item) => (
              <div className="bar-chart-row" key={item.label}>
                <div className="bar-chart-label">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className="bar-chart-track">
                  <span style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
          <p className="app-kicker">Prestamos</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-2">
            Distribucion de movimientos
          </h2>
          <div className="mini-bars">
            {loanChart.map((item) => (
              <div className="mini-bar" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <div>
                  <i style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-panel bg-white rounded-lg shadow p-6">
          <p className="app-kicker">Ejemplares</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-2">
            Estado operativo
          </h2>
          <div className="status-grid">
            {copyChart.map((item) => (
              <div key={item.label} className="status-pill">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
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
