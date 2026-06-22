"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  username: string;
  rol_sistema: "ADMINISTRADOR" | "BIBLIOTECARIO";
  nombre: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password_hash: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = localStorage.getItem("library_user");
  const token = localStorage.getItem("library_token");

  if (!storedUser || !token) {
    return null;
  }

  return JSON.parse(storedUser) as User;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Al cargar la app, verificamos si hay sesión guardada en el navegador
    const sessionUser = getStoredUser();

    setUser(sessionUser);
    setLoading(false);

    if (sessionUser) {
      // Si está autenticado y trata de entrar al login, lo mandamos al dashboard
      if (pathname === "/login") {
        router.push("/");
      }
    } else {
      // Si NO está autenticado y no está en la página de login, lo redirigimos al login
      if (pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [pathname, router]);

  const login = async (username: string, password_hash: string) => {
    const { authApi } = await import("@/lib/api");
    const res = await authApi.login(username, password_hash);

    // Guardamos token y datos del usuario
    localStorage.setItem("library_token", res.access_token);
    localStorage.setItem("library_user", JSON.stringify(res.user));

    setUser(res.user);
    router.push("/"); // Redirige al dashboard
  };

  const logout = () => {
    localStorage.removeItem("library_token");
    localStorage.removeItem("library_user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
