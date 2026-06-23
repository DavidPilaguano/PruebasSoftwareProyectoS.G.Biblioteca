-- Script de persistencia generado automáticamente
-- Asegúrate de limpiar las tablas antes de ejecutar este script si es necesario

-- Datos para la tabla: rol_usuario
INSERT INTO public."rol_usuario" ("id_rol", "nombre", "max_prestamos", "dias_prestamo") OVERRIDING SYSTEM VALUE VALUES (2, 'DOCENTE', 10, 15);
INSERT INTO public."rol_usuario" ("id_rol", "nombre", "max_prestamos", "dias_prestamo") OVERRIDING SYSTEM VALUE VALUES (3, 'INVESTIGADOR', 15, 30);
INSERT INTO public."rol_usuario" ("id_rol", "nombre", "max_prestamos", "dias_prestamo") OVERRIDING SYSTEM VALUE VALUES (4, 'INVITADO', 2, 3);
INSERT INTO public."rol_usuario" ("id_rol", "nombre", "max_prestamos", "dias_prestamo") OVERRIDING SYSTEM VALUE VALUES (1, 'ESTUDIANTE', 5, 21);
INSERT INTO public."rol_usuario" ("id_rol", "nombre", "max_prestamos", "dias_prestamo") OVERRIDING SYSTEM VALUE VALUES (19, 'JMETER_1782165399773', 3, 14);

-- Datos para la tabla: categoria
INSERT INTO public."categoria" ("id_categoria", "nombre", "descripcion") OVERRIDING SYSTEM VALUE VALUES (1, 'INGENIERÍA DE SOFTWARE', 'Metodologías, QA y Arquitectura');
INSERT INTO public."categoria" ("id_categoria", "nombre", "descripcion") OVERRIDING SYSTEM VALUE VALUES (2, 'BASES DE DATOS', 'SQL, NoSQL y Optimización');
INSERT INTO public."categoria" ("id_categoria", "nombre", "descripcion") OVERRIDING SYSTEM VALUE VALUES (3, 'REDES Y SEGURIDAD', 'Ciberseguridad y Telecomunicaciones');
INSERT INTO public."categoria" ("id_categoria", "nombre", "descripcion") OVERRIDING SYSTEM VALUE VALUES (4, 'INTELIGENCIA ARTIFICIAL', 'Deep Learning y NLP');
INSERT INTO public."categoria" ("id_categoria", "nombre", "descripcion") OVERRIDING SYSTEM VALUE VALUES (5, 'MATEMÁTICAS', 'Cálculo, Álgebra y Estadística');
INSERT INTO public."categoria" ("id_categoria", "nombre", "descripcion") OVERRIDING SYSTEM VALUE VALUES (6, 'SISTEMAS OPERATIVOS', 'Linux, Kernel y Virtualización');
INSERT INTO public."categoria" ("id_categoria", "nombre", "descripcion") OVERRIDING SYSTEM VALUE VALUES (7, 'DESARROLLO MÓVIL', 'Flutter, Swift y Android');

-- Datos para la tabla: editorial
INSERT INTO public."editorial" ("id_editorial", "nombre", "pais") OVERRIDING SYSTEM VALUE VALUES (1, 'ADDISON-WESLEY', 'EE.UU.');
INSERT INTO public."editorial" ("id_editorial", "nombre", "pais") OVERRIDING SYSTEM VALUE VALUES (2, 'O-REILLY MEDIA', 'EE.UU.');
INSERT INTO public."editorial" ("id_editorial", "nombre", "pais") OVERRIDING SYSTEM VALUE VALUES (3, 'PRENTICE HALL', 'ESPAÑA');
INSERT INTO public."editorial" ("id_editorial", "nombre", "pais") OVERRIDING SYSTEM VALUE VALUES (4, 'PACKT PUBLISHING', 'REINO UNIDO');
INSERT INTO public."editorial" ("id_editorial", "nombre", "pais") OVERRIDING SYSTEM VALUE VALUES (5, 'MANNING', 'EE.UU.');
INSERT INTO public."editorial" ("id_editorial", "nombre", "pais") OVERRIDING SYSTEM VALUE VALUES (6, 'SPRINGER', 'ALEMANIA');
INSERT INTO public."editorial" ("id_editorial", "nombre", "pais") OVERRIDING SYSTEM VALUE VALUES (7, 'MIT PRESS', 'EE.UU.');

-- Datos para la tabla: autor
INSERT INTO public."autor" ("id_autor", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "nacionalidad") OVERRIDING SYSTEM VALUE VALUES (1, 'ROBERT', NULL, 'MARTIN', NULL, 'ESTADOUNIDENSE');
INSERT INTO public."autor" ("id_autor", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "nacionalidad") OVERRIDING SYSTEM VALUE VALUES (2, 'MARTIN', NULL, 'FOWLER', NULL, 'BRITÁNICO');
INSERT INTO public."autor" ("id_autor", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "nacionalidad") OVERRIDING SYSTEM VALUE VALUES (3, 'ABRAHAM', NULL, 'SILBERSCHATZ', NULL, 'ESTADOUNIDENSE');
INSERT INTO public."autor" ("id_autor", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "nacionalidad") OVERRIDING SYSTEM VALUE VALUES (4, 'ANDREW', NULL, 'TANENBAUM', NULL, 'HOLANDÉS');
INSERT INTO public."autor" ("id_autor", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "nacionalidad") OVERRIDING SYSTEM VALUE VALUES (5, 'BJARNE', NULL, 'STROUSTRUP', NULL, 'DANÉS');
INSERT INTO public."autor" ("id_autor", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "nacionalidad") OVERRIDING SYSTEM VALUE VALUES (6, 'IAN', NULL, 'GOODFELLOW', NULL, 'CANADIENSE');
INSERT INTO public."autor" ("id_autor", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "nacionalidad") OVERRIDING SYSTEM VALUE VALUES (7, 'ERIC', NULL, 'EVANS', NULL, 'ESTADOUNIDENSE');
INSERT INTO public."autor" ("id_autor", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "nacionalidad") OVERRIDING SYSTEM VALUE VALUES (8, 'KENT', NULL, 'BECK', NULL, 'ESTADOUNIDENSE');
INSERT INTO public."autor" ("id_autor", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "nacionalidad") OVERRIDING SYSTEM VALUE VALUES (9, 'LINUS', NULL, 'TORVALDS', NULL, 'FINLANDÉS');
INSERT INTO public."autor" ("id_autor", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "nacionalidad") OVERRIDING SYSTEM VALUE VALUES (10, 'STUART', NULL, 'RUSSELL', NULL, 'BRITÁNICO');

-- Datos para la tabla: usuario_sistema
INSERT INTO public."usuario_sistema" ("id_usuario_sistema", "username", "password_hash", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "estado", "rol_sistema") OVERRIDING SYSTEM VALUE VALUES (2, 'agarcía', 'hash_bib1', 'ANA', NULL, 'GARCIA', NULL, 'ACTIVO', 'BIBLIOTECARIO');
INSERT INTO public."usuario_sistema" ("id_usuario_sistema", "username", "password_hash", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "estado", "rol_sistema") OVERRIDING SYSTEM VALUE VALUES (3, 'mvaca', 'hash_bib2', 'MARCO', NULL, 'VACA', NULL, 'ACTIVO', 'BIBLIOTECARIO');
INSERT INTO public."usuario_sistema" ("id_usuario_sistema", "username", "password_hash", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "estado", "rol_sistema") OVERRIDING SYSTEM VALUE VALUES (5, 'sortega', 'hash_admin2', 'SANDRA', NULL, 'ORTEGA', NULL, 'ACTIVO', 'ADMINISTRADOR');
INSERT INTO public."usuario_sistema" ("id_usuario_sistema", "username", "password_hash", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "estado", "rol_sistema") OVERRIDING SYSTEM VALUE VALUES (6, 'dapilaguano', '85bc6aa4f255a30fb09f90f9f7aabe9f4b2630ad494665a67b9a7ce9d9db24ef', 'David', 'Alexander', 'Pilaguano', 'Chisaguano', 'ACTIVO', 'BIBLIOTECARIO');
INSERT INTO public."usuario_sistema" ("id_usuario_sistema", "username", "password_hash", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "estado", "rol_sistema") OVERRIDING SYSTEM VALUE VALUES (4, 'rjimenez', 'hash_asist', 'ROBERTO', NULL, 'JIMENEZ', NULL, 'ACTIVO', 'BIBLIOTECARIO');
INSERT INTO public."usuario_sistema" ("id_usuario_sistema", "username", "password_hash", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "estado", "rol_sistema") OVERRIDING SYSTEM VALUE VALUES (7, 'testadmin', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Admin', NULL, 'Test', NULL, 'ACTIVO', 'ADMINISTRADOR');
INSERT INTO public."usuario_sistema" ("id_usuario_sistema", "username", "password_hash", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "estado", "rol_sistema") OVERRIDING SYSTEM VALUE VALUES (15, 'dmayuquina', 'bfd8a790f9fc16307ddbed5499801391a459a0a15a2dc7bd913c8d2cbc78bddb', 'Dany', 'Mateo', 'Ayuquina', 'Navas', 'ACTIVO', 'ADMINISTRADOR');
INSERT INTO public."usuario_sistema" ("id_usuario_sistema", "username", "password_hash", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "estado", "rol_sistema") OVERRIDING SYSTEM VALUE VALUES (16, 'admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'Admin', '', 'Sistema', '', 'ACTIVO', 'ADMINISTRADOR');
INSERT INTO public."usuario_sistema" ("id_usuario_sistema", "username", "password_hash", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "estado", "rol_sistema") OVERRIDING SYSTEM VALUE VALUES (1, 'dpilaguano', 'hash_admin', 'Administrador', NULL, 'PILAGUANO', NULL, 'ACTIVO', 'ADMINISTRADOR');

-- Datos para la tabla: libro
INSERT INTO public."libro" ("id_libro", "isbn", "titulo", "anio_publicacion", "descripcion", "id_categoria", "id_editorial") OVERRIDING SYSTEM VALUE VALUES (1, '9780132350884', 'CLEAN CODE', 2008, 'Código limpio', 1, 1);
INSERT INTO public."libro" ("id_libro", "isbn", "titulo", "anio_publicacion", "descripcion", "id_categoria", "id_editorial") OVERRIDING SYSTEM VALUE VALUES (2, '9780136086208', 'DATABASE SYSTEM CONCEPTS', 2019, 'Fundamentos de BDD', 2, 3);
INSERT INTO public."libro" ("id_libro", "isbn", "titulo", "anio_publicacion", "descripcion", "id_categoria", "id_editorial") OVERRIDING SYSTEM VALUE VALUES (3, '9781492045120', 'NETWORK SECURITY', 2021, 'Seguridad en redes', 3, 2);
INSERT INTO public."libro" ("id_libro", "isbn", "titulo", "anio_publicacion", "descripcion", "id_categoria", "id_editorial") OVERRIDING SYSTEM VALUE VALUES (4, '9781801073561', 'SOFTWARE ARCHITECTURE', 2022, 'Microservicios', 1, 4);
INSERT INTO public."libro" ("id_libro", "isbn", "titulo", "anio_publicacion", "descripcion", "id_categoria", "id_editorial") OVERRIDING SYSTEM VALUE VALUES (5, '9780133591620', 'MODERN OPERATING SYSTEMS', 2014, 'Tanenbaum OS', 6, 3);
INSERT INTO public."libro" ("id_libro", "isbn", "titulo", "anio_publicacion", "descripcion", "id_categoria", "id_editorial") OVERRIDING SYSTEM VALUE VALUES (6, '9780262035613', 'DEEP LEARNING', 2016, 'Libro de Ian Goodfellow', 4, 7);
INSERT INTO public."libro" ("id_libro", "isbn", "titulo", "anio_publicacion", "descripcion", "id_categoria", "id_editorial") OVERRIDING SYSTEM VALUE VALUES (7, '9780321125217', 'DOMAIN-DRIVEN DESIGN', 2003, 'Tackling Complexity', 1, 1);
INSERT INTO public."libro" ("id_libro", "isbn", "titulo", "anio_publicacion", "descripcion", "id_categoria", "id_editorial") OVERRIDING SYSTEM VALUE VALUES (8, '9781617299901', 'FLUTTER IN ACTION', 2023, 'Desarrollo móvil', 7, 5);
INSERT INTO public."libro" ("id_libro", "isbn", "titulo", "anio_publicacion", "descripcion", "id_categoria", "id_editorial") OVERRIDING SYSTEM VALUE VALUES (9, '9783319737478', 'ESTADÍSTICA PARA INGENIEROS', 2018, 'Análisis de datos', 5, 6);
INSERT INTO public."libro" ("id_libro", "isbn", "titulo", "anio_publicacion", "descripcion", "id_categoria", "id_editorial") OVERRIDING SYSTEM VALUE VALUES (10, '9780134610993', 'ARTIFICIAL INTELLIGENCE', 2020, 'A Modern Approach', 4, 3);
INSERT INTO public."libro" ("id_libro", "isbn", "titulo", "anio_publicacion", "descripcion", "id_categoria", "id_editorial") OVERRIDING SYSTEM VALUE VALUES (112, '9780132350122', 'Pruebas con SonarQube', 2026, '', 3, 2);

-- Datos para la tabla: libro_autor
INSERT INTO public."libro_autor" ("id_libro", "id_autor") OVERRIDING SYSTEM VALUE VALUES (1, 1);
INSERT INTO public."libro_autor" ("id_libro", "id_autor") OVERRIDING SYSTEM VALUE VALUES (2, 3);
INSERT INTO public."libro_autor" ("id_libro", "id_autor") OVERRIDING SYSTEM VALUE VALUES (3, 4);
INSERT INTO public."libro_autor" ("id_libro", "id_autor") OVERRIDING SYSTEM VALUE VALUES (4, 2);
INSERT INTO public."libro_autor" ("id_libro", "id_autor") OVERRIDING SYSTEM VALUE VALUES (5, 4);
INSERT INTO public."libro_autor" ("id_libro", "id_autor") OVERRIDING SYSTEM VALUE VALUES (6, 6);
INSERT INTO public."libro_autor" ("id_libro", "id_autor") OVERRIDING SYSTEM VALUE VALUES (7, 7);
INSERT INTO public."libro_autor" ("id_libro", "id_autor") OVERRIDING SYSTEM VALUE VALUES (8, 5);
INSERT INTO public."libro_autor" ("id_libro", "id_autor") OVERRIDING SYSTEM VALUE VALUES (9, 10);
INSERT INTO public."libro_autor" ("id_libro", "id_autor") OVERRIDING SYSTEM VALUE VALUES (10, 10);

-- Datos para la tabla: usuario
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (1, '1725544332', 'L00345601', 'CARLOS', NULL, 'ANDRADE', NULL, 'candrade@espe.edu.ec', NULL, 'ACTIVO', 1);
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (2, '1712233445', 'L00345602', 'ELENA', NULL, 'TORRES', NULL, 'etorres@espe.edu.ec', NULL, 'ACTIVO', 2);
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (3, '1755667788', 'L00345603', 'SANTIAGO', NULL, 'CHISAGUANO', NULL, 'schisaguano@espe.edu.ec', NULL, 'ACTIVO', 1);
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (4, '1711223344', 'L00345604', 'MATEO', NULL, 'LOPEZ', NULL, 'mlopez@espe.edu.ec', NULL, 'ACTIVO', 1);
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (5, '0501223344', 'L00345605', 'PAOLA', NULL, 'YANEZ', NULL, 'pyanez@espe.edu.ec', NULL, 'BLOQUEADO', 1);
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (6, '1799887766', 'L00345606', 'LUIS', NULL, 'GARCIA', NULL, 'lgarcia@espe.edu.ec', NULL, 'ACTIVO', 3);
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (7, '1822334455', 'L00345607', 'DIANA', NULL, 'REINOSO', NULL, 'dreinoso@espe.edu.ec', NULL, 'ACTIVO', 1);
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (8, '1733445566', 'L00345608', 'JORGE', NULL, 'PUMA', NULL, 'jpuma@espe.edu.ec', NULL, 'ACTIVO', 2);
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (9, '0202334499', 'L00345609', 'BRYAN', NULL, 'VILLAMARIN', NULL, 'bvilla@espe.edu.ec', NULL, 'INACTIVO', 1);
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (10, '1788776655', 'L00345610', 'KEVIN', NULL, 'MOPOSITA', NULL, 'kmopo@espe.edu.ec', NULL, 'ACTIVO', 1);
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (100, '0504853953', 'L00433223', 'David ', 'Alexander', 'Pilaguano', 'Chisaguano', 'dapilaguano@espe.edu.ec', '0987294293', 'ACTIVO', 3);
INSERT INTO public."usuario" ("id_usuario", "cedula", "codigo_institucional", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "correo", "telefono", "estado", "id_rol") OVERRIDING SYSTEM VALUE VALUES (102, '1782165400014', 'JM1782165400014', 'Usuario', 'JMeter', 'Prueba', 'API', 'jmeter_1782165400014@test.com', '0999999999', 'ACTIVO', 19);

-- Datos para la tabla: ejemplar
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (2, 'CB-001-B', 1, 'DISPONIBLE', 'PISO 1 - A1', NULL);
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (6, 'CB-004-A', 4, 'DISPONIBLE', 'PISO 1 - A2', NULL);
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (8, 'CB-006-A', 6, 'DISPONIBLE', 'PISO 3 - D1', NULL);
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (10, 'CB-008-A', 8, 'DISPONIBLE', 'PISO 2 - B3', NULL);
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (11, 'CB-009-A', 9, 'DISPONIBLE', 'PISO 4 - E1', NULL);
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (12, 'CB-010-A', 10, 'DISPONIBLE', 'PISO 3 - D2', NULL);
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (3, 'CB-002-A', 2, 'PRESTADO', 'PISO 2 - B1', NULL);
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (5, 'CB-003-A', 3, 'PRESTADO', 'PISO 3 - C1', NULL);
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (7, 'CB-005-A', 5, 'PRESTADO', 'PISO 2 - B2', NULL);
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (9, 'CB-007-A', 7, 'PRESTADO', 'PISO 1 - A3', NULL);
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (4, 'CB-002-B', 2, 'PRESTADO', 'PISO 2 - B1', NULL);
INSERT INTO public."ejemplar" ("id_ejemplar", "codigo_barra", "id_libro", "estado", "ubicacion_fisica", "fecha_adquisicion") OVERRIDING SYSTEM VALUE VALUES (1, 'CB-001-A', 1, 'DISPONIBLE', 'PISO 1 - A1', NULL);

-- Datos para la tabla: prestamo
INSERT INTO public."prestamo" ("id_prestamo", "id_usuario", "id_usuario_sistema", "id_ejemplar", "fecha_prestamo", "fecha_devolucion_esperada", "fecha_devolucion_real", "estado") OVERRIDING SYSTEM VALUE VALUES (2, 3, 2, 3, '2026-05-05T10:00:00+00:00', '2026-05-12T10:00:00+00:00', NULL, 'ACTIVO');
INSERT INTO public."prestamo" ("id_prestamo", "id_usuario", "id_usuario_sistema", "id_ejemplar", "fecha_prestamo", "fecha_devolucion_esperada", "fecha_devolucion_real", "estado") OVERRIDING SYSTEM VALUE VALUES (3, 4, 3, 5, '2026-05-10T14:00:00+00:00', '2026-05-17T14:00:00+00:00', NULL, 'ACTIVO');
INSERT INTO public."prestamo" ("id_prestamo", "id_usuario", "id_usuario_sistema", "id_ejemplar", "fecha_prestamo", "fecha_devolucion_esperada", "fecha_devolucion_real", "estado") OVERRIDING SYSTEM VALUE VALUES (4, 6, 2, 7, '2026-05-12T09:00:00+00:00', '2026-05-26T09:00:00+00:00', NULL, 'ACTIVO');
INSERT INTO public."prestamo" ("id_prestamo", "id_usuario", "id_usuario_sistema", "id_ejemplar", "fecha_prestamo", "fecha_devolucion_esperada", "fecha_devolucion_real", "estado") OVERRIDING SYSTEM VALUE VALUES (5, 7, 3, 9, '2026-05-13T11:30:00+00:00', '2026-05-20T11:30:00+00:00', NULL, 'ACTIVO');
INSERT INTO public."prestamo" ("id_prestamo", "id_usuario", "id_usuario_sistema", "id_ejemplar", "fecha_prestamo", "fecha_devolucion_esperada", "fecha_devolucion_real", "estado") OVERRIDING SYSTEM VALUE VALUES (100, 3, 1, 4, '2026-05-19T04:41:43.889276+00:00', '2026-05-20T00:00:00+00:00', NULL, 'ACTIVO');
INSERT INTO public."prestamo" ("id_prestamo", "id_usuario", "id_usuario_sistema", "id_ejemplar", "fecha_prestamo", "fecha_devolucion_esperada", "fecha_devolucion_real", "estado") OVERRIDING SYSTEM VALUE VALUES (1, 1, 2, 1, '2026-05-01T08:00:00+00:00', '2026-05-08T08:00:00+00:00', '2026-05-19T07:09:28.284588+00:00', 'DEVUELTO');

-- Datos para la tabla: reserva
INSERT INTO public."reserva" ("id_reserva", "id_usuario", "id_usuario_sistema", "id_libro", "fecha_reserva", "fecha_expiracion", "estado") OVERRIDING SYSTEM VALUE VALUES (1, 2, 1, 1, '2026-05-14T09:00:00+00:00', '2026-05-16T09:00:00+00:00', 'ACTIVA');
INSERT INTO public."reserva" ("id_reserva", "id_usuario", "id_usuario_sistema", "id_libro", "fecha_reserva", "fecha_expiracion", "estado") OVERRIDING SYSTEM VALUE VALUES (2, 8, 2, 4, '2026-05-14T10:00:00+00:00', '2026-05-16T10:00:00+00:00', 'ACTIVA');
INSERT INTO public."reserva" ("id_reserva", "id_usuario", "id_usuario_sistema", "id_libro", "fecha_reserva", "fecha_expiracion", "estado") OVERRIDING SYSTEM VALUE VALUES (3, 10, 3, 10, '2026-05-14T11:00:00+00:00', '2026-05-16T11:00:00+00:00', 'ACTIVA');

-- Datos para la tabla: sancion
INSERT INTO public."sancion" ("id_sancion", "id_usuario", "id_usuario_sistema", "id_prestamo", "tipo", "monto", "motivo", "estado", "fecha_inicio", "fecha_fin") OVERRIDING SYSTEM VALUE VALUES (1, 5, 1, 1, 'MORA', 15.75, 'Retraso de 15 días', 'PENDIENTE', '2026-05-01', NULL);
INSERT INTO public."sancion" ("id_sancion", "id_usuario", "id_usuario_sistema", "id_prestamo", "tipo", "monto", "motivo", "estado", "fecha_inicio", "fecha_fin") OVERRIDING SYSTEM VALUE VALUES (2, 9, 1, 2, 'DAÑO', 5, 'Páginas rayadas', 'PENDIENTE', '2026-05-10', NULL);

-- La tabla auditoria está vacía

