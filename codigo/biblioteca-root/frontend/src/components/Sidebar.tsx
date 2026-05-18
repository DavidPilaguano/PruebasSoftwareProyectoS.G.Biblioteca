'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Si no hay sesión activa, el menú no debe renderizarse
  if (!user) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-screen z-50">
        {/* Cabecera con datos del Usuario Conectado */}
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900 truncate">{user.nombre}</h1>
          <div className="mt-1.5 flex items-center">
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              {user.rol_sistema}
            </span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* El Dashboard es común para ambos roles */}
          <Link href="/" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition font-medium text-sm">
            Dashboard
          </Link>
          
          {/* 📚 SECCIONES OPERATIVAS (Visibles para BIBLIOTECARIO y ADMINISTRADOR) */}
          <div className="mt-6">
            <p className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Catálogo</p>
            <Link href="/libros" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm mt-1">
              Libros
            </Link>
            <Link href="/ejemplares" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Ejemplares
            </Link>
          </div>

          <div className="mt-6">
            <p className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuarios</p>
            <Link href="/usuarios" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm mt-1">
              Estudiantes
            </Link>
          </div>

          <div className="mt-6">
            <p className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Flujo de Préstamos</p>
            <Link href="/prestamos" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm mt-1">
              Préstamos
            </Link>
            <Link href="/reservas" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Reservas
            </Link>
            <Link href="/sanciones" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Sanciones
            </Link>
          </div>

          {/* ⚙️ SECCIONES DE GESTIÓN AVANZADA (Exclusivas de ADMINISTRADOR) */}
          {user.rol_sistema === 'ADMINISTRADOR' && (
            <>
              <div className="mt-6">
                <p className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Administración</p>
                <Link href="/usuarios-sistema" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm mt-1">
                  Bibliotecarios
                </Link>
                <Link href="/roles" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
                  Roles
                </Link>
              </div>

              <div className="mt-6">
                <p className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Seguridad</p>
                <Link href="/auditoria" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm mt-1 font-medium text-amber-600">
                  Bitácora de Auditoría
                </Link>
              </div>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 text-slate-900 p-4 z-50 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-base font-bold text-slate-900 truncate max-w-[180px]">{user.nombre}</h1>
            <span className="text-[9px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded uppercase">
              {user.rol_sistema}
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl p-1 text-slate-900 focus:outline-none"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        
        {menuOpen && (
          <nav className="mt-4 space-y-1 border-t border-slate-100 pt-3">
            <Link 
              href="/" 
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm font-medium"
            >
              Dashboard
            </Link>

            {/* Menú Operativo Común (Visible para Ambos Roles en Móvil) */}
            <Link href="/libros" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Libros
            </Link>
            <Link href="/ejemplares" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Ejemplares
            </Link>
            <Link href="/usuarios" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Estudiantes
            </Link>
            <Link href="/prestamos" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Préstamos
            </Link>
            <Link href="/reservas" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Reservas
            </Link>
            <Link href="/sanciones" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Sanciones
            </Link>

            {/* Menú de Configuración Avanzada Móvil (Exclusivo de ADMINISTRADOR) */}
            {user.rol_sistema === 'ADMINISTRADOR' && (
              <>
                <div className="border-t border-slate-100 my-2 pt-2">
                  <p className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Administración</p>
                </div>
                <Link href="/usuarios-sistema" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
                  Bibliotecarios
                </Link>
                <Link href="/roles" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
                  Roles
                </Link>
                <Link href="/auditoria" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
                  Auditoría
                </Link>
              </>
            )}

            <button 
              onClick={() => { setMenuOpen(false); logout(); }}
              className="w-full text-left px-4 py-2 mt-4 text-red-600 font-semibold hover:bg-red-50 rounded transition text-sm"
            >
              Cerrar sesión
            </button>
          </nav>
        )}
      </div>

      {/* Offset for mobile to layout underneath fixed element */}
      <div className="md:hidden pt-[68px] w-full" />
    </>
  );
}