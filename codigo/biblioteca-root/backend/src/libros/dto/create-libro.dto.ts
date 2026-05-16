export class CreateLibroDto {
  isbn?: string;
  titulo: string;
  anio_publicacion?: number;
  descripcion?: string;
  id_categoria: number;
  id_editorial: number;
}
