# Pruebas de carga con k6

## Requisitos

- k6 instalado localmente, o usar la imagen/action de k6 en CI.
- Backend ejecutandose y accesible.

## Ejecucion local

```bash
cd codigo/biblioteca-root
k6 run k6/smoke.js
k6 run -e BASE_URL=http://localhost:3001 k6/api-read.js
```

Variables utiles:

- `BASE_URL`: URL base del backend. Por defecto `http://localhost:3001`.
- `VUS`: usuarios virtuales. Por defecto `1` en smoke y `5` en carga.
- `DURATION`: duracion para `smoke.js`.
- `K6_ENDPOINTS`: lista separada por comas para `api-read.js`.

Ejemplo:

```bash
k6 run -e BASE_URL=https://api.example.com -e VUS=10 -e K6_ENDPOINTS=/,/libros,/usuarios k6/api-read.js
```
