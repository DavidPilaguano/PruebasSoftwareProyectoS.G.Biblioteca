const paginas = [
  { ruta: "/", h1: "Dashboard" },
  { ruta: "/login", h1: "Biblioteca ESPE", inputs: ["username", "password"] },
  { ruta: "/auditoria", h1: "Auditoria" },
  { ruta: "/ejemplares", h1: "Ejemplares" },
  {
    ruta: "/ejemplares/crear",
    h1: "Crear Ejemplar",
    inputs: ["codigo_barra", "ubicacion_fisica", "fecha_adquisicion"],
    selects: ["id_libro"],
  },
  {
    ruta: "/ejemplares/[id]",
    h1: "Editar Ejemplar",
    inputs: ["codigo_barra", "ubicacion_fisica"],
    selects: ["estado"],
  },
  { ruta: "/libros", h1: "Libros", inputs: ["busqueda"] },
  {
    ruta: "/libros/crear",
    h1: "Crear Libro",
    inputs: ["titulo", "isbn", "anio_publicacion"], 
    selects: ["id_categoria", "id_editorial"],
    textareas: ["descripcion"],
  },
  {
    ruta: "/libros/[id]",
    h1: "Editar Libro",
    inputs: ["titulo", "isbn", "anio_publicacion"],
    selects: ["id_categoria", "id_editorial"],
    textareas: ["descripcion"],
  },
  {
    ruta: "/libros/autores/crear",
    h1: "Crear Autor",
    inputs: [
      "primer_nombre",
      "segundo_nombre",
      "primer_apellido",
      "segundo_apellido",
      "nacionalidad",
    ],
  },
  {
    ruta: "/libros/categorias/crear",
    h1: "Crear Categoria",
    inputs: ["nombre"],
    textareas: ["descripcion"],
  },
  {
    ruta: "/libros/editoriales/crear",
    h1: "Crear Editorial",
    inputs: ["nombre", "pais"],
  },
  { ruta: "/prestamos", h1: "Prestamos" },
  {
    ruta: "/prestamos/crear",
    h1: "Crear Prestamo",
    inputs: ["fecha_devolucion_esperada"],
    selects: ["id_usuario", "id_usuario_sistema", "id_ejemplar"],
  },
  {
    ruta: "/prestamos/[id]",
    h1: "Editar Prestamo",
    inputs: [
      "usuario",
      "bibliotecario",
      "ejemplar",
      "fecha_devolucion_esperada",
      "fecha_devolucion_real",
    ],
    selects: ["estado"],
  },
  { ruta: "/roles", h1: "Roles de Usuario" },
  {
    ruta: "/roles/crear",
    h1: "Crear Rol de Usuario",
    inputs: ["nombre", "max_prestamos", "dias_prestamo"],
  },
  {
    ruta: "/roles/[id]",
    h1: "Editar Rol",
    inputs: ["nombre", "max_prestamos", "dias_prestamo"],
  },
  { ruta: "/usuarios", h1: "Usuarios/Estudiantes" },
  {
    ruta: "/usuarios/crear",
    h1: "Crear Usuario/Estudiante",
    inputs: [
      "cedula",
      "codigo_institucional",
      "primer_nombre",
      "segundo_nombre",
      "primer_apellido",
      "segundo_apellido",
      "correo",
      "telefono",
    ],
    selects: ["id_rol"],
  },
  {
    ruta: "/usuarios/[id]",
    h1: "Editar Usuario",
    inputs: [
      "cedula",
      "codigo_institucional",
      "primer_nombre",
      "segundo_nombre",
      "primer_apellido",
      "segundo_apellido",
      "correo",
      "telefono",
    ],
    selects: ["estado", "id_rol"],
  },
  { ruta: "/usuarios-sistema", h1: "Usuarios del Sistema" },
  {
    ruta: "/usuarios-sistema/crear",
    h1: "Crear Usuario del Sistema",
    inputs: [
      "username",
      "password_hash",
      "primer_nombre",
      "segundo_nombre",
      "primer_apellido",
      "segundo_apellido",
    ],
    selects: ["rol_sistema"],
  },
  {
    ruta: "/usuarios-sistema/[id]",
    h1: "Editar Usuario del Sistema",
    inputs: [
      "username",
      "primer_nombre",
      "segundo_nombre",
      "primer_apellido",
      "segundo_apellido",
    ],
    selects: ["estado", "rol_sistema"],
  },
];

const crearHtmlPagina = ({ h1, inputs = [], selects = [], textareas = [] }) => `
  <main>
    <h1>${h1}</h1>
    <form>
      ${inputs.map((name) => `<input id="${name}" name="${name}" value="">`).join("")}
      ${selects.map((name) => `<select id="${name}" name="${name}"><option value="1">Opcion</option></select>`).join("")}
      ${textareas.map((name) => `<textarea id="${name}" name="${name}"></textarea>`).join("")}
    </form>
  </main>
`;

const cargarPagina = (pagina) => {
  document.body.innerHTML = crearHtmlPagina(pagina);
};

const stockCritico = (stock, stockMinimo) => stock <= stockMinimo;
const tieneStock = (stock) => stock > 0;

describe("Pruebas HTML de las paginas del sistema biblioteca", () => {
  test("Prueba 1 - toEqual: verifica el valor ingresado en los inputs", () => {
    paginas
      .filter((pagina) => pagina.inputs?.length)
      .forEach((pagina) => {
        cargarPagina(pagina);

        pagina.inputs.forEach((name) => {
          const input = document.getElementById(name);
          const textoAsignado = `Dato de prueba ${pagina.ruta} ${name}`;

          input.value = textoAsignado;

          expect(input.value).toEqual(textoAsignado);
        });
      });
  });

  test("Prueba 2 - toBeGreaterThan: verifica stock mayor al minimo", () => {
    const stock = 20;
    const stockMinimo = 10;

    expect(stock).toBeGreaterThan(stockMinimo);
  });

  test("Prueba 3 - toMatch: verifica el contenido de los textarea descripcion", () => {
    const textoDescripcion = "Laboratorio de Programacion Avanzada";

    paginas
      .filter((pagina) => pagina.textareas?.includes("descripcion"))
      .forEach((pagina) => {
        cargarPagina(pagina);

        const descripcion = document.getElementById("descripcion");
        descripcion.value = textoDescripcion;

        expect(descripcion.value).toMatch(/Laboratorio de Programacion Avanzada/);
      });
  });

  test("Prueba 4 - toBeFalsy: verifica que stockCritico sea falso con stock suficiente", () => {
    const stock = 20;
    const stockMinimo = 10;
    const resultado = stockCritico(stock, stockMinimo);

    expect(resultado).toBeFalsy();
  });

  test("Prueba 5 - toContain: verifica que cada h1 contenga el texto esperado", () => {
    paginas.forEach((pagina) => {
      cargarPagina(pagina);

      const titulo = document.querySelector("h1");

      expect(titulo.textContent).toContain(pagina.h1);
    });
  });

  test("Prueba 6 - toBeTruthy: verifica que tieneStock sea verdadero", () => {
    const stock = 15;
    const resultado = tieneStock(stock);

    expect(resultado).toBeTruthy();
  });

  test("Verifica que todos los selects definidos existan en su HTML", () => {
    paginas
      .filter((pagina) => pagina.selects?.length)
      .forEach((pagina) => {
        cargarPagina(pagina);

        pagina.selects.forEach((name) => {
          const select = document.querySelector(`select[name="${name}"]`);

          expect(Boolean(select)).toBeTruthy();
        });
      });
  });
});
