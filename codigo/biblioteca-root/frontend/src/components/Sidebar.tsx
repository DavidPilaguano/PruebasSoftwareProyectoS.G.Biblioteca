'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-screen">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Biblioteca</h1>
          <p className="text-sm text-slate-600 mt-1">Gestión</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition">
            Dashboard
          </Link>
          
          <div className="mt-6">
            <p className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Catálogo</p>
            <Link href="/libros" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Libros
            </Link>
            <Link href="/ejemplares" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Ejemplares
            </Link>
          </div>

          <div className="mt-6">
            <p className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Usuarios</p>
            <Link href="/usuarios" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Estudiantes
            </Link>
            <Link href="/roles" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Roles
            </Link>
            <Link href="/usuarios-sistema" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Bibliotecarios
            </Link>
          </div>

          <div className="mt-6">
            <p className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Operaciones</p>
            <Link href="/prestamos" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Préstamos
            </Link>
          </div>

          <div className="mt-6">
            <p className="px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Auditoría</p>
            <Link href="/auditoria" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Registro
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 text-slate-900 p-4 z-40">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">Biblioteca</h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-slate-900"
          >
            ☰
          </button>
        </div>
        
        {menuOpen && (
          <nav className="mt-4 space-y-2">
            <Link href="/" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition">
              Dashboard
            </Link>
            <Link href="/libros" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Libros
            </Link>
            <Link href="/ejemplares" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Ejemplares
            </Link>
            <Link href="/usuarios" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Estudiantes
            </Link>
            <Link href="/roles" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Roles
            </Link>
            <Link href="/usuarios-sistema" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Bibliotecarios
            </Link>
            <Link href="/prestamos" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Préstamos
            </Link>
            <Link href="/auditoria" className="block px-4 py-2 rounded hover:bg-blue-50 text-slate-900 transition text-sm">
              Auditoría
            </Link>
          </nav>
        )}
      </div>

      {/* Offset for mobile */}
      <div className="md:hidden pt-16 w-full" />
    </>
  );
}
