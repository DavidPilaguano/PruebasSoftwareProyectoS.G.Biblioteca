'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { librosApi, categoriasApi, editorialesApi } from '@/lib/api';
import { CreateLibroDto, Categoria, Editorial } from '@/types/biblioteca';

export default function CrearLibroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editoriales, setEditoriales] = useState<Editorial[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<CreateLibroDto>({
    titulo: '',
    isbn: '',
    anio_publicacion: new Date().getFullYear(),
    descripcion: '',
    id_categoria: 0,
    id_editorial: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, edits] = await Promise.all([
          categoriasApi.getAll(),
          editorialesApi.getAll(),
        ]);
        setCategorias(cats);
        setEditoriales(edits);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando datos');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'anio_publicacion' || name === 'id_categoria' || name === 'id_editorial' 
        ? parseInt(value) 
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.titulo || !formData.isbn || !formData.id_categoria || !formData.id_editorial) {
      setError('Por favor completa todos los campos requeridos');
      setLoading(false);
      return;
    }

    try {
      await librosApi.create(formData);
      router.push('/libros');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando libro');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="p-6 text-center text-slate-600">Cargando datos...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/libros" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Libros
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Crear Libro</h1>
        <p className="text-slate-600 mt-1">Agrega un nuevo libro al catálogo</p>
      </div>

      <div className="bg-white rounded shadow p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Título *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa el título del libro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              ISBN *
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 978-3-16-148410-0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Año de Publicación
            </label>
            <input
              type="number"
              name="anio_publicacion"
              value={formData.anio_publicacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1400"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Categoría *
            </label>
            <div className="flex gap-2 items-end">
              <select
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              <Link
                href="/libros/categorias/crear"
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium whitespace-nowrap"
              >
                + Nueva
              </Link>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Editorial *
            </label>
            <div className="flex gap-2">
              <select
                name="id_editorial"
                value={formData.id_editorial}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Selecciona una editorial</option>
                {editoriales.map((ed) => (
                  <option key={ed.id_editorial} value={ed.id_editorial}>
                    {ed.nombre}
                  </option>
                ))}
              </select>
              <Link
                href="/libros/editoriales/crear"
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium whitespace-nowrap"
              >
                + Nueva
              </Link>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del libro"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Libro'}
            </button>
            <Link
              href="/libros"
              className="flex-1 bg-slate-300 text-slate-900 py-2 rounded-lg hover:bg-slate-400 transition text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
