"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

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
      <main className="min-h-screen bg-slate-100 w-full flex items-center justify-center text-slate-600">
        Cargando...
      </main>
    );
  }

  if (isLoginPage) {
    return (
      <main className="min-h-screen bg-slate-100 w-full flex items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen w-full relative">
      <Sidebar />
      <main className="flex-1 md:ml-64 overflow-auto min-h-screen bg-gray-50">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
