# Documentación: Estructura del Proyecto y Trazabilidad de Pruebas

Este documento explica en detalle la estructura de carpetas del Sistema de Gestión de Biblioteca, qué partes del código han sido sometidas a pruebas automatizadas, por qué se probaron y cómo se mapean las pruebas con el código fuente (trazabilidad).

---

## 1. Estructura de Carpetas del Proyecto

El repositorio está dividido en dos partes principales, correspondientes a una arquitectura Cliente-Servidor (Frontend y Backend).

### Estructura Raíz
- **/backend**: Contiene el código fuente del servidor (API REST) construido con NestJS.
- **/frontend**: Contiene la aplicación cliente de la interfaz de usuario construida con Next.js y React.
- **/supabase**: Archivos de configuración y bases de datos locales si se estuviera trabajando con Supabase CLI.

### Estructura del Backend (`/backend`)
El backend utiliza la convención modular de NestJS:

- **`/src`**: Contiene la lógica de la aplicación, subdividida por módulos de negocio (ej. `autores/`, `libros/`, `prestamos/`, `usuarios/`, etc.). Cada módulo suele contener:
  - `[modulo].controller.ts`: Recibe y gestiona las solicitudes HTTP, define las rutas (ej. `GET`, `POST`).
  - `[modulo].service.ts`: Contiene la lógica de negocio central e interactúa con la base de datos (Supabase en este caso).
  - `[modulo].module.ts`: Archivo que ensambla los controladores y servicios para que NestJS pueda integrarlos.
- **`/test`**: Contiene **todo** el ecosistema de pruebas automatizadas.
  - **`/test/unit`**: Carpeta destinada exclusivamente a las *Pruebas Unitarias*. Aquí residen los archivos que prueban servicios y controladores de manera aislada usando "Mocks" (simulaciones).
  - Archivos `*.e2e-spec.ts`: Archivos ubicados en la raíz de `/test` que contienen las *Pruebas End-to-End* (De extremo a extremo). Estos archivos lanzan una instancia de la aplicación y realizan peticiones HTTP reales para validar el flujo completo.

### Estructura del Frontend (`/frontend`)
El frontend utiliza la estructura recomendada por Next.js App Router:

- **`/src/app`**: Definición de las páginas y sistema de enrutamiento basado en carpetas (App Router).
- **`/src/components`**: Componentes reutilizables de la interfaz gráfica (botones, modales, layouts, etc.).
- **`/src/context`**: Contextos de React para manejar estados globales en el lado del cliente (como la sesión del usuario).
- **`/src/lib`**: Funciones de utilidad, configuraciones de utilerías auxiliares.
- **`/src/types`**: Definiciones de tipos estrictos de TypeScript para uso en todo el frontend.

---

## 2. Código Probado y Razones de la Prueba

Durante el desarrollo, nos enfocamos en **probar exhaustivamente la capa del Backend**. Esto asegura que los datos y la lógica de negocio sean seguros, confiables y robustos ante cambios futuros.

### ¿Qué código se probó?
1. **Controladores (`*.controller.ts`)**: Se probaron para asegurar que mapeen correctamente la entrada (parámetros y bodies) a los servicios correspondientes.
2. **Servicios (`*.service.ts`)**: Se probaron exhaustivamente porque representan el "corazón" de la aplicación. Se validó que los métodos `create`, `findAll`, `findOne`, `update`, y `remove` ejecuten las operaciones esperadas y manejen errores (ej. un libro no encontrado).
3. **Flujos Completos (Integración E2E)**: Se probaron las integraciones desde la petición HTTP inicial (con Supertest) hasta la interacción con la base de datos de pruebas para validar los módulos de `auditoria`, `autores`, `categorias`, `editoriales`, `ejemplares`, `libros`, `prestamos`, `roles`, y `usuarios`.

### ¿Por qué se probaron?
- **Garantizar la Lógica de Negocio (Aislamiento):** Las pruebas unitarias garantizan que si una regla de negocio falla, el error proviene de nuestra propia lógica y no de dependencias externas (como caídas en la base de datos).
- **Asegurar la Integración Cliente-Base de Datos:** Las pruebas E2E verifican que el servidor interprete correctamente los verbos y respuestas HTTP y que los cambios se reflejen efectivamente en la base de datos (y luego se limpien).
- **Seguridad contra Regresiones:** El contar con un *Test Suite* completo asegura que un desarrollador futuro no introduzca nuevos errores (regresiones) al intentar agregar nuevas funcionalidades en la plataforma de la biblioteca.

---

## 3. Trazabilidad entre Pruebas y Código

La trazabilidad asegura que sepamos de manera precisa qué bloque de código está siendo cubierto por qué archivo de pruebas. En este proyecto se adoptó una **política estricta de convenciones de nombres** para lograr trazabilidad 1:1.

### Reglas de Trazabilidad
- El archivo de origen `src/modulo/archivo.ts` SIEMPRE es probado por un archivo unitario en `test/unit/archivo.spec.ts`.
- Las funcionalidades conjuntas expuestas en `src/modulo/` SIEMPRE son probadas integralmente en el archivo E2E en `test/modulo.e2e-spec.ts`.

### Matriz de Trazabilidad (Backend)

| Módulo de Negocio | Código de Implementación (Fuente) | Pruebas Unitarias (Aislamiento) | Pruebas E2E (Integración Total) |
|:---|:---|:---|:---|
| **Auditoría** | `src/auditoria/auditoria.controller.ts`<br>`src/auditoria/auditoria.service.ts` | `test/unit/auditoria.controller.spec.ts`<br>`test/unit/auditoria.service.spec.ts` | `test/auditoria.e2e-spec.ts` |
| **Autores** | `src/autores/autores.controller.ts`<br>`src/autores/autores.service.ts` | `test/unit/autores.controller.spec.ts`<br>`test/unit/autores.service.spec.ts` | `test/autores.e2e-spec.ts` |
| **Categorías** | `src/categorias/categorias.controller.ts`<br>`src/categorias/categorias.service.ts` | `test/unit/categorias.controller.spec.ts`<br>`test/unit/categorias.service.spec.ts` | `test/categorias.e2e-spec.ts` |
| **Editoriales** | `src/editoriales/editoriales.controller.ts`<br>`src/editoriales/editoriales.service.ts` | `test/unit/editoriales.controller.spec.ts`<br>`test/unit/editoriales.service.spec.ts` | `test/editoriales.e2e-spec.ts` |
| **Ejemplares** | `src/ejemplares/ejemplares.controller.ts`<br>`src/ejemplares/ejemplares.service.ts` | `test/unit/ejemplares.controller.spec.ts`<br>`test/unit/ejemplares.service.spec.ts` | `test/ejemplares.e2e-spec.ts` |
| **Libros** | `src/libros/libros.controller.ts`<br>`src/libros/libros.service.ts` | `test/unit/libros.controller.spec.ts`<br>`test/unit/libros.service.spec.ts` | `test/libros.e2e-spec.ts` |
| **Préstamos** | `src/prestamos/prestamos.controller.ts`<br>`src/prestamos/prestamos.service.ts` | `test/unit/prestamos.controller.spec.ts`<br>`test/unit/prestamos.service.spec.ts` | `test/prestamos.e2e-spec.ts` |
| **Roles** | `src/roles/roles.controller.ts`<br>`src/roles/roles.service.ts` | `test/unit/roles.controller.spec.ts`<br>`test/unit/roles.service.spec.ts` | `test/roles.e2e-spec.ts` |
| **Usuarios** | `src/usuarios/usuarios.controller.ts`<br>`src/usuarios/usuarios.service.ts` | `test/unit/usuarios.controller.spec.ts`<br>`test/unit/usuarios.service.spec.ts` | `test/usuarios.e2e-spec.ts` |
| **Usuarios Sistema** | `src/usuarios-sistema/usuarios-sistema.controller.ts`<br>`src/usuarios-sistema/usuarios-sistema.service.ts` | `test/unit/usuarios-sistema.controller.spec.ts`<br>`test/unit/usuarios-sistema.service.spec.ts` | `test/usuarios-sistema.e2e-spec.ts` |

### Ejemplo Práctico de Trazabilidad en un Flujo
Supongamos un problema: "La creación de un nuevo autor falla".
1. Buscamos el código donde se implementa: `src/autores/autores.service.ts` en el método `create`.
2. Revisamos cómo se simuló este código en la **prueba unitaria**: `test/unit/autores.service.spec.ts` (Aquí evaluamos la lógica).
3. Verificamos cómo se comunicó con el servidor a través del API revisando la **prueba e2e**: `test/autores.e2e-spec.ts` (Aquí comprobamos parámetros de entrada HTTP).

Toda la estructura está diseñada para que cualquier desarrollador pueda seguir la ruta lógica entre lo que hace el sistema y cómo se verifica de forma automatizada.
