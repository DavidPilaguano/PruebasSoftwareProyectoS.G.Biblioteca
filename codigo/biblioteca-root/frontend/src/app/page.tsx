'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Libro } from '@/types/biblioteca';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function LibraryPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [selectedLibro, setSelectedLibro] = useState<number | null>(null);
  const [idUsuario, setIdUsuario] = useState('');
  const [idUsuarioSistema, setIdUsuarioSistema] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getLibros = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('libro')
        .select('id_libro, titulo, isbn, categoria(nombre), editorial(nombre)')
        .order('titulo', { ascending: true });

      setLoading(false);
      if (error) {
        setStatus(`Error cargando libros: ${error.message}`);
        return;
      }

      setLibros(data as Libro[]);
    };
    getLibros();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Biblioteca</h1>
          <p className="mt-2 text-slate-600">
            Lista de libros disponibles y formulario para crear préstamos.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Libros disponibles</h2>
              {loading && libros.length === 0 ? (
                <p className="mt-4 text-slate-500">Cargando libros...</p>
              ) : (
                <div className="mt-4 grid gap-4">
                  {libros.map((libro) => (
                    <article key={libro.id_libro} className="rounded-3xl border border-slate-200 p-4 transition hover:border-slate-400">
                      <h3 className="text-lg font-medium text-slate-900">{libro.titulo}</h3>
                      <p className="mt-1 text-sm text-slate-600">ISBN: {libro.isbn}</p>
                      <p className="mt-2 text-sm text-slate-700">
                        Categoría: {libro.categoria?.nombre ?? 'Sin categoría'}
                      </p>
                      <p className="text-sm text-slate-700">
                        Editorial: {libro.editorial?.nombre ?? 'Desconocida'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedLibro(libro.id_libro)}
                        className={`mt-4 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold ${
                          selectedLibro === libro.id_libro
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {selectedLibro === libro.id_libro ? 'Seleccionado' : 'Seleccionar'}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {status ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900">
                {status}
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Crear préstamo</h2>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">ID del usuario</span>
                <input
                  type="number"
                  value={idUsuario}
                  onChange={(event) => setIdUsuario(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Ej. 1"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">ID del usuario del sistema</span>
                <input
                  type="number"
                  value={idUsuarioSistema}
                  onChange={(event) => setIdUsuarioSistema(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Ej. 101"
                />
              </label>

              <div className="space-y-2">
                <span className="block text-sm font-medium text-slate-700">Libro seleccionado</span>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {selectedLibro ? `Libro #${selectedLibro}` : 'Selecciona un libro de la lista.'}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Enviando...' : 'Crear préstamo'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}