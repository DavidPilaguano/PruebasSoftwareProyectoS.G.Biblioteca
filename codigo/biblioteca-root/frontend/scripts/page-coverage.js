const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const appDir = path.join(rootDir, "src", "app");
const testFile = path.join(rootDir, "tests", "html-pages.test.js");
const outputDir = path.join(rootDir, "coverage", "pages");
const outputFile = path.join(outputDir, "index.html");

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(fullPath);
    }

    return entry.name === "page.tsx" ? [fullPath] : [];
  });

const toRoute = (file) => {
  const relativeDir = path.relative(appDir, path.dirname(file));

  if (relativeDir === "") {
    return "/";
  }

  return `/${relativeDir.replaceAll(path.sep, "/")}`;
};

const sourceRoutes = walk(appDir).map(toRoute).sort();
const testContent = fs.readFileSync(testFile, "utf8");
const testedRoutes = [...testContent.matchAll(/ruta:\s*"([^"]+)"/g)]
  .map((match) => match[1])
  .sort();
const testedRouteSet = new Set(testedRoutes);

const rows = sourceRoutes
  .map((route) => {
    const covered = testedRouteSet.has(route);
    const status = covered ? "Cubierta" : "Pendiente";
    const statusClass = covered ? "ok" : "missing";

    return `<tr>
      <td>${route}</td>
      <td class="${statusClass}">${status}</td>
    </tr>`;
  })
  .join("");

const coveredCount = sourceRoutes.filter((route) => testedRouteSet.has(route)).length;
const totalCount = sourceRoutes.length;
const percentage = totalCount === 0 ? 0 : (coveredCount / totalCount) * 100;

const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Cobertura de paginas</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 32px;
        color: #0f172a;
      }

      h1 {
        margin-bottom: 8px;
      }

      .summary {
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        border-radius: 8px;
        padding: 16px;
        margin: 20px 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        border-bottom: 1px solid #e2e8f0;
        padding: 10px;
        text-align: left;
      }

      th {
        background: #f8fafc;
      }

      .ok {
        color: #166534;
        font-weight: 700;
      }

      .missing {
        color: #991b1b;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <h1>Cobertura de paginas HTML</h1>
    <p>Reporte generado desde <code>src/app/**/page.tsx</code> contra las rutas declaradas en <code>tests/html-pages.test.js</code>.</p>

    <div class="summary">
      <strong>${coveredCount}/${totalCount} paginas cubiertas</strong>
      <div>${percentage.toFixed(2)}%</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Ruta</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
</html>`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, html);

console.log(`Cobertura de paginas: ${coveredCount}/${totalCount} (${percentage.toFixed(2)}%)`);
console.log(outputFile);
