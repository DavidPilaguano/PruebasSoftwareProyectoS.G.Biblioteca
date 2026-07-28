"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const baseItems = [
  { href: "/", label: "Dashboard", code: "DB" },
  { href: "/libros", label: "Libros", code: "LB" },
  { href: "/ejemplares", label: "Ejemplares", code: "EJ" },
  { href: "/usuarios", label: "Estudiantes", code: "US" },
  { href: "/prestamos", label: "Préstamos", code: "PR" },
];

const adminItems = [
  { href: "/usuarios-sistema", label: "Bibliotecarios", code: "BI" },
  { href: "/roles", label: "Roles", code: "RO" },
  { href: "/auditoria", label: "Auditoría", code: "AU" },
];

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const isAdmin = user.rol_sistema === "ADMINISTRADOR";
  const initials = user.nombre
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navLink = (
    item: { href: string; label: string; code: string },
    onClick?: () => void,
  ) => {
    const active =
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClick}
        className={`nav-item ${active ? "nav-item-active" : ""}`}
      >
        <span className="nav-code">{item.code}</span>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <aside className="app-sidebar hidden md:flex">
        <div className="brand-block">
          <div className="brand-mark">BE</div>
          <div>
            <p className="brand-title">Biblioteca ESPE</p>
            <p className="brand-subtitle">Control operativo</p>
          </div>
        </div>

        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-slate-950">
              {user.nombre}
            </h1>
            <span className="role-pill">{user.rol_sistema}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section">Operación</p>
          {baseItems.map((item) => navLink(item))}

          {isAdmin && (
            <>
              <p className="nav-section mt-6">Administración</p>
              {adminItems.map((item) => navLink(item))}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-button">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="mobile-header md:hidden">
        <div className="flex items-center gap-3">
          <div className="brand-mark brand-mark-small">BE</div>
          <div>
            <h1 className="max-w-[180px] truncate text-sm font-bold text-slate-950">
              {user.nombre}
            </h1>
            <span className="role-pill">{user.rol_sistema}</span>
          </div>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="menu-button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? "Cerrar" : "Menú"}
        </button>

        {menuOpen && (
          <nav className="mobile-nav">
            {baseItems.map((item) => navLink(item, () => setMenuOpen(false)))}
            {isAdmin && (
              <>
                <p className="nav-section mt-4">Administración</p>
                {adminItems.map((item) =>
                  navLink(item, () => setMenuOpen(false)),
                )}
              </>
            )}
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="logout-button mt-4"
            >
              Cerrar sesión
            </button>
          </nav>
        )}
      </div>

      <div className="md:hidden pt-[78px] w-full" />
    </>
  );
}
