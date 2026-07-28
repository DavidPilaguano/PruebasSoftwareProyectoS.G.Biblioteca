"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const isLoginPage = pathname === "/login";

  if (loading) {
    return (
      <main className="app-loading min-h-screen w-full flex items-center justify-center text-slate-600">
        <div className="loading-panel">
          <div className="loading-mark" />
          <span>Cargando...</span>
        </div>
      </main>
    );
  }

  if (isLoginPage) {
    return (
      <main className="login-shell min-h-screen w-full flex items-center justify-center">
        <div className="fixed right-5 top-5 z-50">
          <ThemeToggle />
        </div>
        {children}
      </main>
    );
  }

  return (
    <div className="app-shell flex min-h-screen w-full relative">
      <Sidebar />
      <main className="flex-1 md:ml-72 overflow-auto min-h-screen">
        <header className="app-topbar">
          <div>
            <p className="app-kicker">Sistema de gestión bibliotecaria</p>
            <h2 className="app-topbar-title">Biblioteca ESPE</h2>
          </div>
          <ThemeToggle />
        </header>
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}
