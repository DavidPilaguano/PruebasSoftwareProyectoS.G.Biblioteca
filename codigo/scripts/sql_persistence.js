const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Intentar cargar el .env del backend
const envPath = path.join(__dirname, '../biblioteca-root/backend/.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // Fallback a .env local si existe
  dotenv.config();
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan SUPABASE_URL y/o SUPABASE_KEY.');
  console.error(`Asegúrate de que el archivo existe en: ${envPath}`);
  console.error('O crea un archivo .env en esta misma carpeta con esas variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Tablas ordenadas por dependencias para evitar errores de Foreign Key al insertar
const tables = [
  'rol_usuario',
  'categoria',
  'editorial',
  'autor',
  'usuario_sistema',
  'libro',
  'libro_autor',
  'usuario',
  'ejemplar',
  'prestamo',
  'reserva',
  'sancion',
  'auditoria'
];

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  
  // Tratar como string: escapar comillas simples
  let strVal = String(val);
  strVal = strVal.replace(/'/g, "''");
  
  // Reemplazar saltos de línea
  strVal = strVal.replace(/\n/g, "\\n").replace(/\r/g, "");
  
  return `'${strVal}'`;
}

async function generateSqlSeed() {
  console.log('🚀 Iniciando extracción de datos desde Supabase...');
  console.log(`🔗 Conectando a: ${supabaseUrl}\n`);
  
  let sqlScript = '-- Script de persistencia generado automáticamente\n';
  sqlScript += '-- Asegúrate de limpiar las tablas antes de ejecutar este script si es necesario\n\n';

  for (const table of tables) {
    console.log(`📦 Extrayendo datos de la tabla: ${table}...`);
    
    // Extraer todos los registros de la tabla
    const { data, error } = await supabase.from(table).select('*');
    
    if (error) {
      console.error(`❌ Error extrayendo datos de ${table}:`, error.message);
      continue;
    }
    
    if (data && data.length > 0) {
      sqlScript += `-- Datos para la tabla: ${table}\n`;
      
      for (const row of data) {
        // Envolver los nombres de las columnas en comillas dobles para evitar problemas con palabras reservadas
        const columns = Object.keys(row).map(c => `"${c}"`).join(', ');
        const values = Object.values(row).map(escapeSqlValue).join(', ');
        
        sqlScript += `INSERT INTO public."${table}" (${columns}) VALUES (${values});\n`;
      }
      sqlScript += '\n';
      console.log(`   ✅ ${data.length} registros extraídos.`);
    } else {
      sqlScript += `-- La tabla ${table} está vacía\n\n`;
      console.log(`   ⚠️ La tabla está vacía.`);
    }
  }

  const outputPath = path.join(__dirname, 'seed_generado.sql');
  fs.writeFileSync(outputPath, sqlScript, 'utf-8');
  
  console.log(`\n🎉 ¡Extracción completada con éxito!`);
  console.log(`📂 El archivo SQL se ha guardado en: ${outputPath}`);
}

generateSqlSeed();
