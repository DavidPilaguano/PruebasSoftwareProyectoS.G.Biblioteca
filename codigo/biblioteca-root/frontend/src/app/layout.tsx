import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
//import { Sidebar } from '@/components/Sidebar'; 
import Sidebar from "@/components/Sidebar"
import './globals.css'; // O la ruta de tus estilos globales

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} w-full h-full m-0 p-0`}
    >
      <body className="w-full h-full m-0 p-0 bg-white">
        {/* 🔐 Envolvemos con el proveedor de autenticación */}
        <AuthProvider>
          <div className="flex min-h-screen w-full relative">
            <Sidebar />
            <main className="flex-1 md:ml-64 overflow-auto min-h-screen bg-gray-50">
              <div className="p-8">{children}</div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}