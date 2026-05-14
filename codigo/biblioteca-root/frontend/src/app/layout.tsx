import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biblioteca - Sistema de Gestión",
  description: "Sistema de gestión de préstamos de libros",
};

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
        <Sidebar />
        <main className="md:ml-64 overflow-auto min-h-screen pt-16 md:pt-0 bg-gray-50">
          <div className="p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
