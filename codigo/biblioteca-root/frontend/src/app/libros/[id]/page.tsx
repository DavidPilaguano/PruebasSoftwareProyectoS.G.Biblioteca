'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { librosApi, categoriasApi, editorialesApi } from '@/lib/api';
import { Libro, UpdateLibroDto, Categoria, Editorial } from '@/types/biblioteca';

export default function EditarLibroPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libro, setLibro] = useState<Libro | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editoriales, setEditoriales] = useState<Editorial[]>([]);

  const [formData, setFormData] = useState<UpdateLibroDto>({
    titulo: '',
    isbn: '',
    anio_publicacion: new Date().getFullYear(),
    descripcion: '',
    id_categoria: undefined,
    id_editorial: undefined,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [libroData, categoriasList, editorialList] = await Promise.all([
          librosApi.getById(id),
          categoriasApi.getAll(),
          editorialesApi.getAll(),
        ]);
        setLibro(libroData);
        setCategorias(categoriasList);
        setEditoriales(editorialList);
        setFormData({
          titulo: libroData.titulo,
          isbn: libroData.isbn,
          anio_publicacion: libroData.anio_publicacion,
          descripcion: libroData.descripcion,
          id_categoria: libroData.id_categoria,
          id_editorial: libroData.id_editorial,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando libro');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

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
    setSaving(true);
    setError(null);

    try {
      await librosApi.update(id, formData);
      router.push('/libros');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando libro');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-600">Cargando...</div>;
  }

  if (!libro) {
    return <div className="p-6 text-center text-red-600">Libro no encontrado</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/libros" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a Libros
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Editar Libro</h1>
        <p className="text-slate-600 mt-1">{libro.titulo}</p>
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
            <select
              name="id_categoria"
              value={formData.id_categoria || 0}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Editorial *
            </label>
            <select
              name="id_editorial"
              value={formData.id_editorial || 0}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Selecciona una editorial</option>
              {editoriales.map((ed) => (
                <option key={ed.id_editorial} value={ed.id_editorial}>
                  {ed.nombre}
                </option>
              ))}
            </select>
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
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
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
