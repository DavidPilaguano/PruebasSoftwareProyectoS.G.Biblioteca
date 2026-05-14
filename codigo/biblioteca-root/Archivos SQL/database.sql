-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.auditoria (
  id_auditoria bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  tabla_afectada character varying NOT NULL,
  id_registro bigint NOT NULL,
  accion character varying NOT NULL CHECK (accion::text = ANY (ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying]::text[])),
  usuario_sistema character varying NOT NULL,
  fecha_evento timestamp with time zone NOT NULL DEFAULT now(),
  valor_anterior text,
  valor_nuevo text,
  CONSTRAINT auditoria_pkey PRIMARY KEY (id_auditoria)
);
CREATE TABLE public.autor (
  id_autor bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  primer_nombre character varying NOT NULL,
  segundo_nombre character varying,
  primer_apellido character varying NOT NULL,
  segundo_apellido character varying,
  nacionalidad character varying,
  CONSTRAINT autor_pkey PRIMARY KEY (id_autor)
);
CREATE TABLE public.categoria (
  id_categoria bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre character varying NOT NULL UNIQUE,
  descripcion text,
  CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria)
);
CREATE TABLE public.editorial (
  id_editorial bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre character varying NOT NULL UNIQUE,
  pais character varying,
  CONSTRAINT editorial_pkey PRIMARY KEY (id_editorial)
);
CREATE TABLE public.ejemplar (
  id_ejemplar bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  codigo_barra character varying UNIQUE,
  id_libro bigint NOT NULL,
  estado character varying NOT NULL DEFAULT 'DISPONIBLE'::character varying CHECK (estado::text = ANY (ARRAY['DISPONIBLE'::character varying, 'PRESTADO'::character varying, 'PERDIDO'::character varying, 'DANIADO'::character varying, 'MANTENIMIENTO'::character varying]::text[])),
  ubicacion_fisica character varying,
  fecha_adquisicion date,
  CONSTRAINT ejemplar_pkey PRIMARY KEY (id_ejemplar),
  CONSTRAINT ejemplar_id_libro_fkey FOREIGN KEY (id_libro) REFERENCES public.libro(id_libro)
);
CREATE TABLE public.libro (
  id_libro bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  isbn character varying UNIQUE,
  titulo character varying NOT NULL,
  anio_publicacion integer CHECK (anio_publicacion IS NULL OR anio_publicacion >= 1400),
  descripcion text,
  id_categoria bigint NOT NULL,
  id_editorial bigint NOT NULL,
  CONSTRAINT libro_pkey PRIMARY KEY (id_libro),
  CONSTRAINT libro_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categoria(id_categoria),
  CONSTRAINT libro_id_editorial_fkey FOREIGN KEY (id_editorial) REFERENCES public.editorial(id_editorial)
);
CREATE TABLE public.libro_autor (
  id_libro bigint NOT NULL,
  id_autor bigint NOT NULL,
  CONSTRAINT libro_autor_pkey PRIMARY KEY (id_libro, id_autor),
  CONSTRAINT libro_autor_id_libro_fkey FOREIGN KEY (id_libro) REFERENCES public.libro(id_libro),
  CONSTRAINT libro_autor_id_autor_fkey FOREIGN KEY (id_autor) REFERENCES public.autor(id_autor)
);
CREATE TABLE public.prestamo (
  id_prestamo bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_usuario bigint NOT NULL,
  id_usuario_sistema bigint NOT NULL,
  id_ejemplar bigint NOT NULL,
  fecha_prestamo timestamp with time zone NOT NULL DEFAULT now(),
  fecha_devolucion_esperada timestamp with time zone,
  fecha_devolucion_real timestamp with time zone,
  estado character varying NOT NULL DEFAULT 'ACTIVO'::character varying CHECK (estado::text = ANY (ARRAY['ACTIVO'::character varying, 'DEVUELTO'::character varying, 'ATRASADO'::character varying, 'CANCELADO'::character varying]::text[])),
  CONSTRAINT prestamo_pkey PRIMARY KEY (id_prestamo),
  CONSTRAINT prestamo_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario),
  CONSTRAINT prestamo_id_usuario_sistema_fkey FOREIGN KEY (id_usuario_sistema) REFERENCES public.usuario_sistema(id_usuario_sistema),
  CONSTRAINT prestamo_id_ejemplar_fkey FOREIGN KEY (id_ejemplar) REFERENCES public.ejemplar(id_ejemplar)
);
CREATE TABLE public.reserva (
  id_reserva bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_usuario bigint NOT NULL,
  id_usuario_sistema bigint NOT NULL,
  id_libro bigint NOT NULL,
  fecha_reserva timestamp with time zone NOT NULL DEFAULT now(),
  fecha_expiracion timestamp with time zone NOT NULL,
  estado character varying NOT NULL DEFAULT 'ACTIVA'::character varying CHECK (estado::text = ANY (ARRAY['ACTIVA'::character varying, 'EXPIRADA'::character varying, 'COMPLETADA'::character varying, 'CANCELADA'::character varying]::text[])),
  CONSTRAINT reserva_pkey PRIMARY KEY (id_reserva),
  CONSTRAINT reserva_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario),
  CONSTRAINT reserva_id_usuario_sistema_fkey FOREIGN KEY (id_usuario_sistema) REFERENCES public.usuario_sistema(id_usuario_sistema),
  CONSTRAINT reserva_id_libro_fkey FOREIGN KEY (id_libro) REFERENCES public.libro(id_libro)
);
CREATE TABLE public.rol_usuario (
  id_rol bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre character varying NOT NULL UNIQUE,
  max_prestamos integer NOT NULL CHECK (max_prestamos > 0),
  dias_prestamo integer NOT NULL CHECK (dias_prestamo > 0),
  CONSTRAINT rol_usuario_pkey PRIMARY KEY (id_rol)
);
CREATE TABLE public.sancion (
  id_sancion bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_usuario bigint NOT NULL,
  id_usuario_sistema bigint NOT NULL,
  id_prestamo bigint NOT NULL,
  tipo character varying NOT NULL,
  monto numeric DEFAULT 0 CHECK (monto >= 0::numeric),
  motivo text,
  estado character varying NOT NULL DEFAULT 'ACTIVA'::character varying CHECK (estado::text = ANY (ARRAY['PENDIENTE'::character varying, 'PAGADA'::character varying, 'ACTIVA'::character varying, 'CONDONADA'::character varying]::text[])),
  fecha_inicio date NOT NULL DEFAULT CURRENT_DATE,
  fecha_fin date,
  CONSTRAINT sancion_pkey PRIMARY KEY (id_sancion),
  CONSTRAINT sancion_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario),
  CONSTRAINT sancion_id_usuario_sistema_fkey FOREIGN KEY (id_usuario_sistema) REFERENCES public.usuario_sistema(id_usuario_sistema),
  CONSTRAINT sancion_id_prestamo_fkey FOREIGN KEY (id_prestamo) REFERENCES public.prestamo(id_prestamo)
);
CREATE TABLE public.usuario (
  id_usuario bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  cedula character varying UNIQUE,
  codigo_institucional character varying NOT NULL UNIQUE,
  primer_nombre character varying NOT NULL,
  segundo_nombre character varying,
  primer_apellido character varying NOT NULL,
  segundo_apellido character varying,
  correo character varying NOT NULL UNIQUE,
  telefono character varying,
  estado character varying NOT NULL DEFAULT 'ACTIVO'::character varying CHECK (estado::text = ANY (ARRAY['ACTIVO'::character varying, 'SUSPENDIDO'::character varying, 'INACTIVO'::character varying, 'BLOQUEADO'::character varying]::text[])),
  id_rol bigint NOT NULL,
  CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario),
  CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol_usuario(id_rol)
);
CREATE TABLE public.usuario_sistema (
  id_usuario_sistema bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  username character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  primer_nombre character varying NOT NULL,
  segundo_nombre character varying,
  primer_apellido character varying NOT NULL,
  segundo_apellido character varying,
  estado character varying NOT NULL DEFAULT 'ACTIVO'::character varying CHECK (estado::text = ANY (ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying, 'BLOQUEADO'::character varying]::text[])),
  rol_sistema character varying NOT NULL CHECK (rol_sistema::text = ANY (ARRAY['ADMINISTRADOR'::character varying, 'BIBLIOTECARIO'::character varying]::text[])),
  CONSTRAINT usuario_sistema_pkey PRIMARY KEY (id_usuario_sistema)
);