'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // ⏳ Control de carga
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
        setError(null);
        setIsLoading(true);
        await login(username, password);
    } catch (err) {
        setError('Usuario o contraseña incorrectos');
      setIsLoading(false); // Liberamos el formulario si hay un fallo
    }
    };

    return (
    <div className="fixed inset-0 min-h-screen flex items-center justify-center bg-slate-100 p-4 z-[9999]">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Biblioteca ESPE</h1>
        <p className="text-slate-600 text-center text-sm mb-6">Inicia sesión con tu cuenta de sistema</p>

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm mb-4 font-medium animate-shake">
            {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
            <input
                type="text"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. admin"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
                type="password"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
            />
            </div>

            <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 active:bg-blue-800 transition font-medium text-sm flex justify-center items-center h-10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
            {isLoading ? (
                <div className="flex items-center space-x-2">
                {/* Spinner de carga SVG minimalista */}
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Validando credenciales...</span>
                </div>
            ) : (
                'Ingresar al Sistema'
            )}
            </button>
        </form>
        </div>
    </div>
    );
}