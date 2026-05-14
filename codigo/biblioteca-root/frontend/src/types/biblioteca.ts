export interface Libro {
    id_libro: number;
    titulo: string;
    isbn: string;
    categoria: { nombre: string };
    editorial: { nombre: string };
}

export interface Prestamo {
    id_usuario: number;
    id_ejemplar: number;
    id_usuario_sistema: number;
}